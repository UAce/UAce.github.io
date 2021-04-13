---
layout: post
title: How to Setup Ambassador Edge Stack's Automatic TLS with ACME
tags:
- Ambassador Edge Stack
- Kubernetes
- DevOps
categories:
- Tutorial
label: new
author: Yu-Yueh Liu
date: 2021-04-13 00:14 -0400
---
At my current company Ormuco Inc., we use **Ambassador Edge Stack** ([AES](https://www.getambassador.io/)) as our Kubernetes-native API Gateway with HTTPS enabled and TLS termination. Until recently, we had been generating certificates using **Certbot** and renewing them with automated scripts.

In this article, I will walk you through a better way to manage certificates in Kubernetes using Ambassador Edge Stack's automatic TLS with ACME.

## Prerequisites
This tutorial requires you have the following:

* A Kubernetes cluster
* A domain name
* Ambassador Edge Stack deployed in your cluster (see [here](https://www.getambassador.io/docs/edge-stack/latest/topics/install/#img-classos-logo-srcimageskubernetespng-install-via-kubernetes-yaml))
* Your domain name pointing to the Ambassador LoadBalancer's external IP

## What is Ambassador Automatic TLS?
> The **Ambassador Edge Stack** has simple and easy built-in support for automatically using ACME to create and renew TLS certificates; configured by the Host resource. However, it only supports ACME's **http-01 challenge**; if you require more flexible certificate management (such as using ACME's **dns-01 challenge**, or using a non-ACME certificate source), the Ambassador Edge stack also supports using external certificate management tools.
> 
> One such tool is **Jetstack**'s cert-manager, which is a general-purpose tool for managing certificates in Kubernetes. Cert-manager will automatically create and renew TLS certificates and store them as Kubernetes secrets for easy use in a cluster. The Ambassador Edge Stack will automatically watch for secret changes and reload certificates upon renewal.


Essentially, we can deploy Cert-Manager to manage certificates in Kubernetes for us. Ambassador only supports HTTP-01 challenge but it's possible to perform DNS-01 challenge using Cert-Manager.

***Note**: We use GoDaddy domain names and it is not a supported DNS Provider (see [list of supported providers](https://cert-manager.io/docs/configuration/acme/dns01/#supported-dns01-providers)). There are several Cert-Manager Godaddy Webhook implementations online but they don't seem to be well maintained so I decided to stick with HTTP-01 challenge.*

## How to Setup Automatic TLS with ACME?
For tutorial, I will be using an arbitrary email <ins>my-email@gmail.com</ins> and **Let's Encrypt** to Issue a certificate for an arbitrary domain name <ins>dev.mydomain.com</ins>.

#### Install the Cert-Manager tool with kubectl
```Bash
# Install Custom Resource Definition for Cert-Manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.crds.yaml

# Install Cert-Manager
kubectl apply -f https://github.com/jetstack/cert-manager/releases/latest/download/cert-manager.yaml
```   
***Note**: You can also install Cert-Manager with Helm (see [here](https://cert-manager.io/docs/installation/kubernetes/#installing-with-helm))*
   
#### Create a ClusterIssuer resource
> An Issuer or ClusterIssuer identifies which Certificate Authority cert-manager will use to issue a certificate. Issuer is a namespaced resource allowing you to use different CAs in each namespace, a ClusterIssuer is used to issue certificates in any namespace. Configuration depends on which ACME challenge you are using.

```YAML
---
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    # Replace this email address with your own.
    # Let's Encrypt will use this to contact you about expiring
    # certificates, and issues related to your account.
    email: my-email@gmail.com
    # ACME URL, you can use the URL for Staging environment to Issue untrusted certificates
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      # Secret resource that will be used to store the account's private key.
      name: issuer-account-private-key
    solvers:
    # Define the solver to perform HTTP-01 challenge
    - http01:
        ingress:
          class: nginx
      selector: {}
```

#### Create a Certificate resource
> A Certificate is a namespaced resource that specifies fields that are used to generated certificate signing requests which are then fulfilled by the issuer type you have referenced. Certificates specify which issuer they want to obtain the certificate from by specifying the certificate.spec.issuerRef field.

```YAML
---
apiVersion: cert-manager.io/v1alpha2
kind: Certificate
metadata:
  name: dev.mydomain.com
  # Cert-manager will put the resulting Secret in the same Kubernetes 
  # namespace as the Certificate. You should create the certificate in 
  # whichever namespace you want to configure a Host.
spec:
  secretName: dev.mydomain.com
  issuerRef:
    # Name of ClusterIssuer
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - dev.mydomain.com
```

#### Create a Mapping and Service resource for HTTP challenge
At this point, Cert-manager will have created a temporary pod named `cm-acme-http-solver-xxxx` but no certificate has been issued. You will need to create a Mapping resource to allow Ambassador to reach the http-01 challenge solver via `http://dev.mydomain.com/.well-known/acme-challenge/<some-token>`

```YAML
---
apiVersion: getambassador.io/v2
kind: Mapping
metadata:
  name: acme-challenge-mapping
spec:
  prefix: /.well-known/acme-challenge/
  rewrite: ""
  service: acme-challenge-service
---
apiVersion: v1
kind: Service
metadata:
  name: acme-challenge-service
spec:
  ports:
  - port: 80
    targetPort: 8089
  selector:
    acme.cert-manager.io/http01-solver: "true"
```
After applying the template, you will need to wait a couple of minutes before cert-manager retries the challenge and issues a certificate.

You should verify that the secret is created:
```Bash
kubectl get secrets dev.mydomain.com
```


#### Create a Host resource for your domain name
This will register your ACME account, read the certificate from the **secretName** you defined in your Certificate resource and use that certificate to terminate TLS on your domain.

```YAML
---
apiVersion: getambassador.io/v2
kind: Host
metadata:
  name: dev.mydomain.com
  namespace: default
spec:
  acmeProvider:
    authority: 'https://acme-v02.api.letsencrypt.org/directory'
    email: my-email@gmail.com
  ambassadorId:
    - default
  hostname: dev.mydomain.com
  selector:
    matchLabels:
      hostname: dev.mydomain.com
  tlsSecret:
    name: dev.mydomain.com # The secretName defined in your Certificate resource
```

You can monitor the events for to follow the certificate generation process:
```Bash
kubectl get events -n default # The namespace in which you created your Host resource
```

## Conclusion
Ambassador Edge Stack automatically enables TLS termination/HTTPs and you can configure it to completely manage TLS by requesting a certificate from a Certificate Authority(CA) or to read an existing certificate from a Kubernetes secret that is managed by yourself.

🐢

## References
* **[Ambassador Transport Layer Security (TLS)][aes-tls]**
* **[Ambassador ACME Support][host-crd]**
* **[Ambassador and Cert-Manager HTTP-01 Challenge][cert-manager]**

[aes-tls]: https://www.getambassador.io/docs/edge-stack/latest/topics/running/tls/
[host-crd]: https://www.getambassador.io/docs/edge-stack/latest/topics/running/host-crd
[cert-manager]: https://www.getambassador.io/docs/edge-stack/latest/howtos/cert-manager/#http-01-challenge
