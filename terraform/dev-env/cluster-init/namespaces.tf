resource "kubernetes_namespace" "create-sgma-system-namespace" {
  metadata {
    name = var.sgma-system-namespace
  }
  depends_on = [ null_resource.ingress_deployment ]
}

resource "kubernetes_namespace" "create-argocd-namespace" {
  metadata {
    name = var.argocd-namespace
  }
  depends_on = [ null_resource.ingress_deployment ]
}

