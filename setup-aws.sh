#!/usr/bin/env bash
# ==============================================================================
# The Candle Lab — Automated AWS EC2 Production Deployment Script
# Supports: Ubuntu 24.04 / 26.04 LTS (x86_64 / arm64)
# ==============================================================================

set -e

echo "=========================================================="
echo "🕯️  Starting The Candle Lab Production Server Deployment  🕯️"
echo "=========================================================="

# 1. Setup 2GB Swap file to prevent Out-Of-Memory during builds
echo "⚙️ [1/7] Configuring Swap Space..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✓ 2GB Swap activated."
else
    echo "✓ Swap already exists."
fi

# 2. Update packages and install core dependencies
echo "📦 [2/7] Installing System Utilities & Nginx..."
sudo apt-get update -y
sudo apt-get install -y git curl wget unzip gnupg2 software-properties-common nginx

# 3. Install PHP 8.3 and required extensions for Laravel & PostgreSQL
echo "🐘 [3/7] Installing PHP 8.3 & PostgreSQL Modules..."
sudo add-apt-repository -y ppa:ondrej/php || true
sudo apt-get update -y
sudo apt-get install -y php8.3 php8.3-fpm php8.3-cli php8.3-pgsql php8.3-curl \
    php8.3-mbstring php8.3-xml php8.3-zip php8.3-gd php8.3-bcmath php8.3-intl

# Install Composer
if ! command -v composer &> /dev/null; then
    echo "Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    sudo chmod +x /usr/local/bin/composer
fi
echo "✓ PHP $(php -v | head -n 1) & Composer installed."

# 4. Install Node.js 20 LTS & npm
echo "🟢 [4/7] Installing Node.js 20 LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
echo "✓ Node.js $(node -v) & npm $(npm -v) installed."

# 5. Setup Project Directory in /var/www/thecandlelab
echo "📂 [5/7] Deploying Codebase & Dependencies..."
APP_DIR="/var/www/thecandlelab"
CURRENT_DIR=$(pwd)

if [ "$CURRENT_DIR" != "$APP_DIR" ]; then
    sudo mkdir -p $APP_DIR
    sudo cp -r ./* $APP_DIR/
    sudo cp -r ./.* $APP_DIR/ 2>/dev/null || true
    cd $APP_DIR
fi

# Ensure .env exists
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    sed -i 's/APP_ENV=local/APP_ENV=production/g' backend/.env
    sed -i 's/APP_DEBUG=true/APP_DEBUG=false/g' backend/.env
fi

# Install Backend Composer Packages
cd $APP_DIR/backend
composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate --force || true
php artisan config:clear
php artisan config:cache
php artisan route:cache

# Build Frontend
cd $APP_DIR/frontend
echo "VITE_API_BASE_URL=/api" > .env.production
npm install --legacy-peer-deps
npm run build

# Fix permissions
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 775 $APP_DIR/backend/storage $APP_DIR/backend/bootstrap/cache

# 6. Configure Nginx Web Server
echo "🌐 [6/7] Configuring Nginx Web Server..."
PHP_SOCKET="/run/php/php8.3-fpm.sock"
if [ ! -e "$PHP_SOCKET" ]; then
    PHP_SOCKET=$(find /run/php/ -name "php*-fpm.sock" | head -n 1)
fi

sudo tee /etc/nginx/sites-available/thecandlelab > /dev/null <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Single Page App
    root $APP_DIR/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Laravel API Backend Proxy
    location /api {
        root $APP_DIR/backend/public;
        try_files \$uri \$uri/ /index.php?\$query_string;

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:$PHP_SOCKET;
            fastcgi_param SCRIPT_FILENAME $APP_DIR/backend/public/index.php;
            include fastcgi_params;
        }
    }

    # Static assets caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# Enable Nginx Site
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/thecandlelab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart php8.3-fpm || sudo systemctl restart php*-fpm
sudo systemctl restart nginx
sudo systemctl enable nginx

# 7. Complete!
PUBLIC_IP=$(curl -s ifconfig.me || echo "52.65.186.239")
echo "=========================================================="
echo "🎉  THE CANDLE LAB IS LIVE ON AWS EC2!  🎉"
echo "=========================================================="
echo "Storefront URL: http://$PUBLIC_IP"
echo "Admin Portal:   http://$PUBLIC_IP/#admin"
echo "=========================================================="
