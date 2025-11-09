# Stage 1: Build Vite frontend
FROM node:18 AS build
WORKDIR /app
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Stage 2: Run backend + serve built frontend
FROM node:18
WORKDIR /app

# Copy backend files
COPY backend ./backend

# Copy built frontend (Vite uses 'dist', not 'build')
COPY --from=build /app/frontend/dist ./backend/public

WORKDIR /app/backend
RUN npm install --legacy-peer-deps

EXPOSE 5000
CMD ["node", "query.js"]
