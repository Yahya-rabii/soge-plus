kubectl create secret docker-registry regcred \
    --docker-username=salaheddine122 \
    --docker-password=${token} \
    --docker-email=salaheddinemorchid1@gmail.com
kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission