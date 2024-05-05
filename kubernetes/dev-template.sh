minikube start --container-runtime=containerd --memory 10240 --cpus 8 --driver docker --static-ip 192.168.100.100
minikube addons enable ingress

#Use first to mount minio config and tls
minikube ssh
sudo mkdir /etc/tls
sudo mkdir /etc/data
sudo chown 1001 /etc/data
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
    --docker-email=salaheddinemorchid1@gmail.com
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission
kubectl apply --recursive -f operators/cert-manager

kubectl apply --recursive -f operators/sealed-secrets
kubectl delete -n kube-system secrets sealed-secrets-key**
kubectl apply --recursive -f $HOME/Bureau/SOGE/Configs/seal_stuff/sealed.yaml #delete old one
kubectl apply --recursive -f secrets 

# Execute this block to wait for operator to finish initializing
kubectl wait --for=condition=available deployment/cert-manager -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-cainjector -n cert-manager --timeout=300s
kubectl wait --for=condition=available deployment/cert-manager-webhook -n cert-manager --timeout=300s
kubectl apply --recursive -f clusterissuers

kubectl apply --recursive -f ingresses

kubectl create --recursive -f crds


kubectl apply --recursive -f operators/prom-operator
apply --recursive -f components





