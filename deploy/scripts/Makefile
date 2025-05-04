.PHONY: dev-up dev-down build deploy

# Development
dev-up:
	cd ../docker && docker-compose up -d

dev-down:
	cd ../docker && docker-compose down

# Build
build:
	docker build -t pdf-checklists-frontend:latest -f ../../apps/frontend/Dockerfile ../../apps/frontend
	docker build -t pdf-checklists-backend:latest -f ../../apps/backend/Dockerfile ../../apps/backend

# Deployment
deploy:
	helm upgrade --install pdf-checklists ../helm/pdf-checklists \
		--namespace pdf-checklists \
		--create-namespace \
		--wait

# Clean
clean:
	helm uninstall pdf-checklists --namespace pdf-checklists
	kubectl delete namespace pdf-checklists

# Port forward for local testing
port-forward:
	kubectl port-forward svc/pdf-checklists-frontend 8080:80 -n pdf-checklists 