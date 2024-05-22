minikube start --container-runtime=containerd --memory 10240 --cpus 8 --driver docker --static-ip 192.168.100.100
minikube addons enable ingress

#Use first to mount minio config and tls
minikube ssh
sudo mkdir /etc/tls
sudo mkdir -p /etc/data
sudo chown -R 1001 /etc/data
exit
#then
minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/Keycloak.key /etc/tls/tls.key
minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/X509Certificate.crt /etc/tls/tls.crt



 


kubectl apply --recursive -f namespaces
kubectl apply --recursive -f globalconfigmaps 
kubectl apply --recursive -f rbac

#export your docker registry token first then
kubectl create secret docker-registry regcred \
    --docker-username=salaheddine122 \
    --docker-password=${token} \
    --docker-email=salaheddinemorchid1@gmail.com \
    --namespace=sgma-system

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
kubectl apply --recursive -f operators/cert-manager

kubectl apply --recursive -f operators/sealed-secrets
kubectl delete -n kube-system secrets sealed-secrets-key**
kubectl apply --recursive -f $HOME/Bureau/SOGE/Configs/seal_stuff/sealed.yaml #delete old one
kubectl apply --recursive -f secrets 

kubectl apply -f /home/salaheddine/Bureau/SOGE/Configs/secrets/secrets.yaml


# Execute this block to wait for operator to finish initializing
kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-cainjector -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-webhook -n cert-manager --timeout=300s
kubectl apply --recursive -f clusterissuers

kubectl apply --recursive -f ingresses

kubectl create --recursive -f crds

kubectl apply --recursive -f operators/prom-operator
apply --recursive -f components

# Helm running
helm install client-service-chart ./client-service-chart
helm install account-service-chart ./account-service-chart # wont work because ui is more advanced than backend
helm install socgen-ui-chart ./socgen-ui-chart 
helm install keycloak-chart ./keycloak-chart
helm install minio-chart ./minio-chart
# wait a bit ( i'll implement pod dependency later )
helm install contract-service-chart ./contract-service-chart
helm install auth-service-chart ./auth-service-chart
helm install gateway-service-chart ./gateway-service-chart
helm install loan-service-chart ./loan-service-chart


