.PHONY: dev-up dev-down dev-frontend dev-backend build deploy clean test lint install

# Development
dev-up:
	cd apps/backend && npm run dev & \
	cd apps/frontend && npm run dev

dev-frontend:
	cd apps/frontend && npm run dev

dev-backend:
	cd apps/backend && npm run dev

dev-down:
	-pkill -f "node.*apps/frontend"
	-pkill -f "node.*apps/backend" 
	-pkill -f "npm run dev"
	-pkill -f "node server.js"
	-pkill -f "nodemon"
	-pkill -f "vite"
	@echo "Shutting down all development services..."

# Testing and Linting
test:
	npm test --workspaces

lint:
	npm run lint --workspaces

# Build
build-frontend:
	docker build -t pdf-checklists-frontend:latest -f apps/frontend/Dockerfile apps/frontend

build-backend:
	docker build -t pdf-checklists-backend:latest -f apps/backend/Dockerfile apps/backend

build: build-frontend build-backend

# Deployment
deploy:
	helm upgrade --install pdf-checklists deploy/helm/pdf-checklists \
		--namespace pdf-checklists \
		--create-namespace \
		--wait

# Clean
clean:
	helm uninstall pdf-checklists --namespace pdf-checklists
	kubectl delete namespace pdf-checklists

# Development Tools
port-forward:
	kubectl port-forward svc/pdf-checklists-frontend 8080:80 -n pdf-checklists

# Install Dependencies
install:
	npm install
	npm install --workspace=@pdf-checklists/frontend
	npm install --workspace=@pdf-checklists/backend