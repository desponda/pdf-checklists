# Build stage
FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install --no-workspaces --production
COPY . .

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/server.js ./

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"] 