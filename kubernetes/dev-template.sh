minikube start --container-runtime=containerd --memory 5120 --cpus 4 --driver docker --static-ip 192.168.100.100

minikube addons enable ingress

minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/Keycloak.key /etc/tls/tls.key
minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/X509Certificate.crt /etc/tls/tls.crt


token="YOUR DOCKER CONTAINER RUNTIME TOKEN" 

kubectl create secret docker-registry regcred \
    --docker-username=<yourregistryusername> \
    --docker-password=${token} \
    --docker-email=<youremail>

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

kubectl create --recursive -f crds
kubectl apply --recursive -f namespaces

kubectl apply --recursive -f operators/prom-operator
apply --recursive -f components





minikube start --container-runtime=containerd --memory 5120 --cpus 4 --driver docker --static-ip 192.168.100.100

minikube addons enable ingress

minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/Keycloak.key /etc/tls/tls.key
minikube cp /home/salaheddine/Bureau/SOGE/CA/Keycloak/X509Certificate.crt /etc/tls/tls.crt


token="YOUR DOCKER CONTAINER RUNTIME TOKEN" 

kubectl create secret docker-registry regcred \
    --docker-username=<yourregistryusername> \
    --docker-password=${token} \
    --docker-email=<youremail>

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

kubectl create --recursive -f crds
kubectl apply --recursive -f namespaces

kubectl create --recursive -f crds
kubectl apply --recursive -f namespaces

kubectl apply -f operators/cert-manager
kubectl apply -f operators/prom-operator
kubectl apply -n argocd -f operators/argocd


kubectl apply --recursive -f secrets
kubectl apply --recursive -f clusterissuers

kubectl apply --recursive -f components
kubectl apply --recursive -f ingresses





