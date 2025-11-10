#  Build Vite frontend
FROM node:18 AS build
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

#  Run backend and serve frontend
FROM node:18
WORKDIR /app

# Copy backend source
COPY backend ./backend

# Copy built frontend files into backend/public (for serving)
COPY --from=build /app/frontend/dist ./backend/public

WORKDIR /app/backend

# Install backend dependencies
RUN npm install --legacy-peer-deps

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["node", "query.js"]
