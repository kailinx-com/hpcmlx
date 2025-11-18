# HPCMLX Kubernetes Deployment

Kubernetes manifests for deploying the HPCMLX application.

## Quick Start

### 1. Build and Push Images

```bash
# Backend
cd backend
docker build -t kailinxdocker/hpcmlx-backend:latest .
docker push kailinxdocker/hpcmlx-backend:latest

# Frontend
cd ../frontend
docker build --build-arg VITE_API_URL=http://backend-service:8000 -t kailinxdocker/hpcmlx-frontend:latest .
docker push kailinxdocker/hpcmlx-frontend:latest
```

### 2. Configure

**Note:** Image references are already configured in the deployment files:
- `backend/deployment.yaml` - Uses `kailinxdocker/hpcmlx-backend:latest`
- `frontend/deployment.yaml` - Uses `kailinxdocker/hpcmlx-frontend:latest`

**Create secrets:**
```bash
cp secrets.yaml.example secrets.yaml
# Generate secret key:
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
# Edit secrets.yaml with SECRET_KEY and DB_PASSWORD
```

**Update configmap.yaml:**
- `ALLOWED_HOSTS` - Your domain(s)
- `CSRF_TRUSTED_ORIGINS` - Your domain(s) with https://
- `DB_HOST` - Database host (use RDS endpoint for production)

**Update ingress.yaml:**
- `host` - Your domain
- `ingressClassName` - Match your ingress controller
- Uncomment TLS section for production

### 3. Deploy

```bash
# Apply all resources
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f postgres/
kubectl apply -f backend/
kubectl apply -f frontend/
kubectl apply -f ingress.yaml  # Optional for local testing
```

Or using kustomize:
```bash
kubectl apply -k .
# Note: secrets.yaml must be applied separately
kubectl apply -f secrets.yaml
```

### 4. Verify

```bash
kubectl get all -n hpcmlx
kubectl get pods -n hpcmlx
kubectl logs -f deployment/backend -n hpcmlx
```