# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy PM2 config
COPY ecosystem.config.js .

# Install PM2 globally
RUN npm install pm2 -g

# Create volume for logs
VOLUME ["/app/logs"]

# Expose ports
EXPOSE 8005

# Set environment variables
ENV NODE_ENV=production \
    PORT=8005

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8005/health || exit 1

# Start the application with PM2
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"] 