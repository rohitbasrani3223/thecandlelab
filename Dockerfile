# ==============================================================================
# The Candle Lab — High-Performance Laravel 12 Production Backend
# Powered by FrankenPHP (Go-based Caddy + PHP 8.3 + OPcache + Redis)
# ==============================================================================
FROM dunglas/frankenphp:1-php8.3-alpine

# Install optimized PHP extensions
RUN install-php-extensions \
    pdo_pgsql \
    pgsql \
    gd \
    zip \
    opcache \
    redis \
    bcmath \
    intl

WORKDIR /app/backend

# Install Composer binary from official composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY backend/ ./

# Install vendor packages optimized for production
RUN composer install --no-dev --optimize-autoloader --no-interaction || true

# Production OPcache & Memory Tuning
RUN echo "opcache.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.interned_strings_buffer=16" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.max_accelerated_files=10000" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/docker-php-ext-opcache.ini \
    && echo "memory_limit=256M" >> /usr/local/etc/php/conf.d/docker-php-memory.ini

# Ensure storage & cache permissions
RUN chmod -R 777 /app/backend/storage /app/backend/bootstrap/cache || true

EXPOSE 8085

# 1. Warm Laravel caches (config, route, view) on container start
# 2. Launch multi-threaded FrankenPHP production web engine on port 8085
CMD ["sh", "-c", "php artisan config:cache || true && php artisan route:cache || true && php artisan view:cache || true && exec frankenphp php-server --root=/app/backend/public --listen=:8085"]
