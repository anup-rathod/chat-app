# =========================
# 1️⃣ Build Frontend
# =========================
FROM node:20 AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies for frontend
RUN npm install

# Copy frontend source code
COPY frontend ./

# Build frontend
RUN npm run build


# =========================
# 2️⃣ Build Backend
# =========================
FROM node:20 AS backend-build

# Set working directory for backend
WORKDIR /app

# Copy backend package files
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend ./backend

# Copy frontend build into /app/frontend/dist
COPY --from=frontend-build /app/frontend/dist ./frontend/dist



# =========================
# 3️⃣ Final Production Image
# =========================
FROM node:20

# Set working directory
WORKDIR /app

# Copy backend from build stage
COPY --from=backend-build /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "backend/server.js"]
