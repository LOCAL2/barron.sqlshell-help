# 🚀 Deployment Guide

## การ Deploy MySQL Shell Command Generator

### 📋 Prerequisites

- Node.js 18+ หรือ Bun
- Git
- Web Server (Nginx, Apache, หรือ Cloud Platform)

---

## 🏗️ Build for Production

### 1. Build Project

```bash
# ใช้ Bun
bun run build

# หรือ npm
npm run build
```

Output จะอยู่ใน folder `dist/`

### 2. Test Production Build

```bash
# Preview production build
bun run preview
# หรือ
npm run preview
```

เปิด `http://localhost:4173` เพื่อทดสอบ

---

## 🌐 Deploy to Static Hosting

### Vercel

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to Production
vercel --prod
```

หรือเชื่อม GitHub Repository กับ Vercel:
1. ไปที่ https://vercel.com
2. Import GitHub Repository
3. Vercel จะ Auto-deploy ทุกครั้งที่ push

### Netlify

```bash
# ติดตั้ง Netlify CLI
npm i -g netlify-cli

# Build และ Deploy
netlify deploy --prod --dir=dist
```

หรือใช้ Netlify UI:
1. ไปที่ https://netlify.com
2. Drag & Drop folder `dist/`
3. หรือเชื่อม GitHub Repository

### GitHub Pages

```bash
# ติดตั้ง gh-pages
npm i -D gh-pages

# เพิ่ม script ใน package.json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}

# Build และ Deploy
npm run build
npm run deploy
```

ตั้งค่า GitHub Pages:
1. ไปที่ Repository Settings
2. Pages → Source → gh-pages branch
3. เข้าถึงได้ที่ `https://username.github.io/repo-name`

### Cloudflare Pages

```bash
# ติดตั้ง Wrangler
npm i -g wrangler

# Deploy
wrangler pages publish dist
```

หรือเชื่อม GitHub:
1. ไปที่ https://pages.cloudflare.com
2. Connect GitHub Repository
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 🐳 Deploy with Docker

### 1. สร้าง Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. สร้าง nginx.conf

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 3. Build และ Run

```bash
# Build Docker Image
docker build -t mysqlsh-generator .

# Run Container
docker run -d -p 8080:80 mysqlsh-generator

# เข้าถึงได้ที่ http://localhost:8080
```

### 4. Deploy to Docker Hub

```bash
# Tag Image
docker tag mysqlsh-generator username/mysqlsh-generator:latest

# Push to Docker Hub
docker push username/mysqlsh-generator:latest
```

---

## ☁️ Deploy to Cloud Platforms

### AWS S3 + CloudFront

```bash
# ติดตั้ง AWS CLI
npm i -g aws-cli

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront Cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Google Cloud Storage

```bash
# ติดตั้ง gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Build
npm run build

# Upload to GCS
gsutil -m rsync -r -d dist/ gs://your-bucket-name

# Set public access
gsutil iam ch allUsers:objectViewer gs://your-bucket-name
```

### Azure Static Web Apps

```bash
# ติดตั้ง Azure CLI
npm i -g @azure/static-web-apps-cli

# Deploy
swa deploy dist
```

---

## 🔧 Environment Configuration

### Vite Environment Variables

สร้างไฟล์ `.env.production`:

```env
VITE_APP_TITLE=MySQL Shell Generator
VITE_API_URL=https://api.example.com
```

ใช้ใน Code:

```typescript
const title = import.meta.env.VITE_APP_TITLE;
```

---

## 🔒 Security Considerations

### 1. Content Security Policy (CSP)

เพิ่มใน `index.html`:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;">
```

### 2. HTTPS Only

ใช้ HTTPS เสมอใน Production:
- Vercel, Netlify, Cloudflare Pages มี HTTPS ฟรี
- AWS: ใช้ CloudFront + ACM Certificate
- Self-hosted: ใช้ Let's Encrypt

### 3. Security Headers

เพิ่มใน Nginx config:

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
```

---

## 📊 Performance Optimization

### 1. Enable Compression

Nginx:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. Cache Static Assets

Nginx:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN

ใช้ CDN สำหรับ Static Assets:
- Cloudflare
- AWS CloudFront
- Google Cloud CDN

---

## 🔍 Monitoring

### 1. Error Tracking

ติดตั้ง Sentry:

```bash
npm i @sentry/react
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

### 2. Analytics

Google Analytics:

```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🧪 CI/CD Pipeline

### GitHub Actions

สร้างไฟล์ `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📝 Checklist ก่อน Deploy

- [ ] Build ผ่านโดยไม่มี Error
- [ ] ทดสอบ Production Build ใน Local
- [ ] ตรวจสอบ Environment Variables
- [ ] เปิด HTTPS
- [ ] ตั้งค่า Security Headers
- [ ] เปิด Compression
- [ ] ตั้งค่า Cache
- [ ] ติดตั้ง Error Tracking
- [ ] ติดตั้ง Analytics (ถ้าต้องการ)
- [ ] ทดสอบบน Mobile และ Desktop
- [ ] ตรวจสอบ Performance (Lighthouse)

---

## 🆘 Troubleshooting

### Build Failed

```bash
# ลบ node_modules และ lock file
rm -rf node_modules package-lock.json

# ติดตั้งใหม่
npm install

# Build อีกครั้ง
npm run build
```

### Blank Page หลัง Deploy

ตรวจสอบ Base URL ใน `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/your-repo-name/', // สำหรับ GitHub Pages
  // หรือ
  base: '/', // สำหรับ Custom Domain
});
```

### 404 on Refresh

ตั้งค่า Redirect ใน Hosting:

Netlify (`_redirects`):
```
/*    /index.html   200
```

Vercel (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

Made with ❤️ for MySQL Shell users
