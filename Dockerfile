# Multi-stage Dockerfile for The Candle Lab Platform

# Stage 1: Build Next.js Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Laravel 11 Backend & Production Setup
FROM php:8.2-cli-alpine AS runner
WORKDIR /app/backend

# Install PHP extensions required for Laravel
RUN apk add --no-cache libpng-dev libjpeg-turbo-dev freetype-dev zip libzip-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql gd zip

COPY backend/ ./
EXPOSE 8085

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8085"]

