minikube start --container-runtime=containerd --memory 10240 --cpus 8 --driver docker --static-ip 192.168.100.100
minikube addons enable ingress

#Use first to mount minio config and tls
minikube ssh
sudo mkdir /etc/tls
sudo mkdir -p /etc/data
sudo chown -R 1001 /etc/data
exit
#then
keycloak_key_path="/home/salaheddine/Bureau/SOGE/CA/Keycloak/Keycloak.key"
keycloak_crt_path="/home/salaheddine/Bureau/SOGE/CA/Keycloak/X509Certificate.crt"
minikube cp $keycloak_key_path /etc/tls/tls.key
minikube cp $keycloak_crt_path /etc/tls/tls.crt

kubectl apply --recursive -f namespaces

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

kubectl apply --recursive -f operators/cert-manager

kubectl apply -f /home/salaheddine/Bureau/SOGE/Configs/secrets/sealed-secret-tls.yaml


# Execute this block to wait for operator to finish initializing
kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-cainjector -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-webhook -n cert-manager --timeout=300s
helm install startup-chart ../helm-charts/startup-chart


# Helm running
helm install argocd-chart ../helm-charts/argo-cd -n argocd
argocd proj create socgen-project --dest "*,*" --src '*' --allow-cluster-resource '*' --allow-namespaced-resource '*'
argocd repo add git@github.com:Yahya-rabii/SGMA-System.git --name socgen-repo --project socgen-project --insecure-ignore-host-key --ssh-private-key-path ~/.ssh/id_ed25519

k apply --recursive -f ../helm-chart-manifests/startup
k apply --recursive -f ../helm-chart-manifests/keycloak
k apply --recursive -f ../helm-chart-manifests/minio

helm install client-service-chart ../helm-charts/client-service-chart
helm install account-service-chart ../helm-charts/account-service-chart # wont work because ui is more advanced than backend
helm install socgen-ui-chart ../helm-charts/socgen-ui-chart 
# wait a bit ( i'll implement pod dependency later )
helm install contract-service-chart ../helm-charts/contract-service-chart
helm install auth-service-chart ../helm-charts/auth-service-chart
helm install gateway-service-chart ../helm-charts/gateway-service-chart
helm install loan-service-chart ../helm-charts/loan-service-chart
