# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .
RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:alpine

# Set default backend URL for local development
ENV BACKEND_URL=http://localhost:5000

# Copy built files and nginx config
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Container will wait for environment variables to be substituted into the nginx config
CMD ["/bin/sh", "-c", "envsubst '$BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]