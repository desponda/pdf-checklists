# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy root workspace files
COPY ../../package*.json ./
COPY ../../.npmrc ./

# Copy frontend workspace files
COPY package*.json ./apps/frontend/
COPY . ./apps/frontend/

# Install dependencies and build
RUN npm install
RUN cd apps/frontend && npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 