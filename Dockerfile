# Multi-stage Dockerfile for The Candle Lab Platform

# Stage 1: Build Next.js Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Django Backend & Production Setup
FROM python:3.12-slim AS runner
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir django djangorestframework django-cors-headers gunicorn

COPY backend/ ./backend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--chdir", "backend", "core.wsgi:application"]
