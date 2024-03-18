variable "sgma-system-namespace" {
  default = "sgma-system"
}

variable "argocd-namespace" {
  default = "argocd"
}

variable "argo-target-path" {
  default = "kubernetes/manifests"
}

variable "project-url" {
  default = "https://github.com/Yahya-rabii/SGMA-System"
}

variable "argo-target-branch" {
  default = "devops"
}