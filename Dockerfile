# Laravel 12 Backend & Production Setup
FROM php:8.3-cli-alpine
WORKDIR /app/backend

# Install PHP extensions required for Laravel & PostgreSQL
RUN apk add --no-cache libpng-dev libjpeg-turbo-dev freetype-dev zip libzip-dev postgresql-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_pgsql pgsql gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY backend/ ./
RUN composer install --no-dev --optimize-autoloader --no-interaction || true

EXPOSE 8085

CMD ["sh", "-c", "php artisan config:clear && php artisan serve --host=0.0.0.0 --port=${PORT:-8085}"]
