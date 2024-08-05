#!/usr/bin/env bash

set -euo pipefail  # Exit immediately if a command exits with a non-zero status

# Enable shell options
shopt -s expand_aliases  # Enable alias expansion

# Define Kubernetes alias for convenience
alias k="kubectl"

# Start Minikube with specified resources and Docker driver
minikube start --container-runtime=containerd --memory 10240 --cpus 8 --driver docker --static-ip 192.168.100.100

# SSH into Minikube to create necessary directories with appropriate permissions
ssh -o StrictHostKeyChecking=no -i ~/.minikube/machines/minikube/id_rsa docker@$(minikube ip) << 'EOF'
sudo mkdir -p /etc/tls /etc/data
sudo chown -R 1001 /etc/data
EOF

# Enable required Minikube addons
minikube addons enable ingress

# Define paths for TLS key and certificate
keycloak_key_path="/home/salaheddine/Bureau/SOGE/CA/Keycloak/Keycloak.key"
keycloak_crt_path="/home/salaheddine/Bureau/SOGE/CA/Keycloak/X509Certificate.crt"

# Copy TLS key and certificate to Minikube
minikube cp "$keycloak_key_path" /etc/tls/tls.key
minikube cp "$keycloak_crt_path" /etc/tls/tls.crt

# Apply Kubernetes resources from specified directories
k apply --recursive -f namespaces
k delete -A ValidatingWebhookConfiguration ingress-nginx-admission
k apply --recursive -f operators/cert-manager
k apply -f /home/salaheddine/Bureau/SOGE/Configs/secrets/sealed-secret-tls.yaml

# Wait for cert-manager deployments to be available
k wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
k wait --for=condition=available deployment/cert-manager-cainjector -n cert-manager --timeout=300s
k wait --for=condition=available deployment/cert-manager-webhook -n cert-manager --timeout=300s

# Install Argo CD using Helm and wait for its components to be ready
helm install argocd-chart ../helm-charts/argo-cd -n argocd || true
k wait --for=condition=available deployment/argocd-chart-applicationset-controller -n argocd --timeout=300s
k wait --for=condition=available deployment/argocd-chart-server -n argocd --timeout=300s
k wait --for=condition=available deployment/argocd-chart-dex-server -n argocd --timeout=300s
k wait --for=condition=ready pod/argocd-chart-application-controller-0 -n argocd --timeout=300s

# Retrieve Argo CD initial admin password and login
while true; do
    echo "Attempting to retrieve password..."
    encoded_password=$(k -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}")

    if [ $? -eq 0 ]; then
        echo "Password retrieval successful."
        break
    else
        echo "Password retrieval failed. Retrying in 5 seconds..."
        sleep 5
    fi
done

password=$(k -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)

set +e  # Disable immediate exit on error

while true; do
    argocd login minikube-argocd.socgen.com --username admin --password "$password" --skip-test-tls --insecure
    if [[ $? -eq 0 ]]; then
        echo "Successful login to Argo CD."
        argocd proj create socgen-project --dest "*,*" --src '*' --allow-cluster-resource '*/*' --allow-namespaced-resource '*/*' --upsert
        argocd repo add git@github.com:Yahya-rabii/SGMA-System.git --name socgen-repo --project socgen-project --insecure-ignore-host-key --ssh-private-key-path ~/.ssh/id_ed25519
        break
    else
        echo "Argo CD login failed. Waiting for server readiness..."
        sleep 10
    fi
done

set -e  # Enable immediate exit on error after successful login

# Apply sealed secrets operator and sync application
k apply --recursive -f ../helm-chart-manifests/sealed-secrets-operator
argocd app sync sealed-secrets-operator-dev

# Wait for the sealed secrets operator deployment to be available
k wait --for=condition=available deployment/sealed-secrets-operator-dev -n sealed-secrets --timeout=300s

# Apply sealed secrets for the development environment
k apply --recursive -f ../helm-chart-manifests/sealed-secrets-dev
argocd app sync sealed-secrets-dev

# Apply other necessary Helm chart manifests and sync applications
k apply --recursive -f ../helm-chart-manifests/startup/2.0.0
argocd app sync startup-dev

# Apply Prometheus stack CRDs and sync applications
k apply --recursive -f ../helm-chart-manifests/kube-prometheus-stack/crds.yaml
argocd app sync kube-prometheus-crds-dev

# Apply Prometheus stack manifests and sync applications
k apply --recursive -f ../helm-chart-manifests/kube-prometheus-stack
argocd app sync kube-prometheus-stack-dev --retry-limit 2

# Apply various service manifests and sync applications
k apply --recursive -f ../helm-chart-manifests/dashboard
argocd app sync dashboard-dev
k apply --recursive -f ../helm-chart-manifests/keycloak
argocd app sync keycloak-dev
k apply --recursive -f ../helm-chart-manifests/minio
argocd app sync minio-dev

# Apply individual service manifests and sync applications
services=(client-service account-service socgen-ui contract-service auth-service gateway-service loan-service)
for service in "${services[@]}"; do
  k apply --recursive -f "../helm-chart-manifests/$service/2.0.0"
  argocd app sync $service-dev
done

# Display Argo CD initial admin password
echo "Your Argo CD password is: $password"
