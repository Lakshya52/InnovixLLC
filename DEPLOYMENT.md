# 🚀 Detailed Deployment Guide: Hostinger VPS (Ubuntu)

This document provides a comprehensive, step-by-step walkthrough for deploying the **InnovixLLC** application. Each command is explained so you understand exactly what is happening to your server.

---

## 📋 Prerequisites
- **Server**: Hostinger KVM 2 (Ubuntu 22.04 LTS recommended).
- **Domain**: Pointed to your VPS IP via DNS A-Records.
- **SSH Client**: Terminal (Mac/Linux) or PowerShell (Windows).

---

## 🛠️ Step 1: Server Environment Setup

### 1. Update and Install Core Software
First, we update the server's package list and install the "Engine" (Node.js), the "Database" (MySQL), and the "Web Server" (Nginx).

```bash
# Update the list of available software and upgrade existing ones
sudo apt update && sudo apt upgrade -y

# Download and run the NodeSource setup script to prepare for Node.js 20 installation
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js, Git (to pull code), Nginx (to show the site), and MySQL (the database)
sudo apt install -y nodejs git nginx mysql-server
```

### 2. Secure your Database
This script helps you set a root password and remove insecure default settings in MySQL.
```bash
sudo mysql_secure_installation
```
*Tip: When asked, select 'Y' for all security prompts.*

---

## 🗄️ Step 2: Database Configuration
We need to create a specific "room" (Database) and a "keyholder" (User) for your application data.

1. **Log into MySQL** (using the password you set in the previous step):
   ```bash
   sudo mysql -u root -p
   ```

2. **Run these SQL commands** inside the MySQL terminal:
   ```sql
   /* Create a blank database specifically for this website */
   CREATE DATABASE innovix_prod;

   /* Create a new user so the website doesn't use the 'root' super-user (safer) */
   CREATE USER 'innovix_user'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD';

   /* Give this new user permission to manage the new database */
   GRANT ALL PRIVILEGES ON innovix_prod.* TO 'innovix_user'@'localhost';

   /* Refresh permissions and exit */
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

## 📦 Step 3: Application Deployment

### 1. Download your code
Navigate to the standard Linux web folder and clone your project.
```bash
cd /var/www
git clone <YOUR_GITHUB_REPO_URL> innovixllc
cd innovixllc
```

### 2. Setup environment and dependencies
```bash
# Install all the libraries your project needs (Prisma, Next.js, etc.)
npm install

# Create your production environment file
nano .env
```
**In the .env file, paste your production MySQL URL:**
`DATABASE_URL="mysql://innovix_user:YOUR_SECURE_PASSWORD@localhost:3306/innovix_prod"`

### 3. Initialize the Database & Build
```bash
# Tell Prisma to prepare the database connection logic
npx prisma generate

# Create the tables in your MySQL database based on your schema
npx prisma migrate deploy

# Create your Admin User so you can log in immediately
node seed.js

# Compile the Next.js code for production (optimizes speed)
npm run build
```

---

## 🏃 Step 4: Keep the App Alive (PM2)
By default, if you close your terminal, the website stops. **PM2** ensures the website runs 24/7.

```bash
# Install the Process Manager
sudo npm install -g pm2

# Start your website and give it a name
pm2 start npm --name "innovix-app" -- start

# Make sure PM2 starts automatically if the server reboots
pm2 save
pm2 startup
```

---

## 🌐 Step 5: Nginx & SSL (The Public Face)
Nginx acts as a "Gatekeeper" that takes traffic from your domain and sends it to your Next.js app on port 3000.

1. **Create the configuration file**:
   ```bash
   sudo nano /etc/nginx/sites-available/innovix
   ```
2. **Paste this "Reverse Proxy" code**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000; # Sends traffic to your app
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. **Enable and Start Nginx**:
   ```bash
   # Create a shortcut to enable the site
   sudo ln -s /etc/nginx/sites-available/innovix /etc/nginx/sites-enabled/

   # Test for typos
   sudo nginx -t

   # Refresh Nginx to apply changes
   sudo systemctl restart nginx
   ```

### 🔒 Step 6: Install Free SSL (HTTPS)
This makes your site secure (the green padlock) and encrypts customer payments.
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔄 How to Update the Site later?
Whenever you make changes to your code locally and push to GitHub, run this on the VPS:
```bash
cd /var/www/innovixllc
git pull                 # Download new code
npm install              # Install any new libraries
npx prisma generate      # Update database connection
npx prisma migrate deploy # Apply any database changes
npm run build            # Recompile the app
pm2 restart innovix-app  # Refresh the running website
```
