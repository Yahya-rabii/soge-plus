minikube start --container-runtime=containerd --memory 5120 --cpus 4 --driver docker --static-ip 192.168.100.100

minikube addons enable ingress

token="YOUR DOCKER CONTAINER RUNTIME TOKEN" 

kubectl create secret docker-registry regcred \
    --docker-username=<yourregistryusername> \
    --docker-password=${token} \
    --docker-email=<youremail>

kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission

kubectl create --recursive -f crds
kubectl apply --recursive -f namespaces

kubectl apply --recursive -f operators/prom-operator                                                  ─╯


