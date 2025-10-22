# CostaBrowser - Railway Deployment Guide

## Railway'e Deploy Etme

### 1. GitHub'a Yükle

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Railway'de Proje Oluştur

1. https://railway.app/ adresine gidin
2. "New Project" → "Deploy from GitHub repo" seçin
3. Repository'yi seçin

### 3. Environment Variables Ekle

Railway dashboard'da Variables sekmesine gidin ve şu değişkenleri ekleyin:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=costa-browser-secret-2025
VITE_APP_TITLE=CostaBrowser
```

### 4. Database Ekle

1. Railway dashboard'da "New" → "Database" → "Add PostgreSQL"
2. Otomatik olarak `DATABASE_URL` environment variable eklenecek

### 5. Deploy

Railway otomatik olarak deploy edecek. Build logs'u kontrol edin.

## Production URL

Deploy tamamlandıktan sonra Railway size bir public URL verecek:
- `https://costa-browser-production.up.railway.app`

## Troubleshooting

### Build Hatası
- `pnpm install` çalıştığından emin olun
- Node.js version 20+ gerekli

### Database Bağlantı Hatası
- `DATABASE_URL` environment variable'ının eklendiğinden emin olun
- PostgreSQL database'in aktif olduğunu kontrol edin

### Port Hatası
- Railway otomatik olarak `PORT` environment variable sağlar
- Kodda `process.env.PORT` kullanıldığından emin olun

## Local Development

```bash
pnpm install
pnpm dev
```

Development server: http://localhost:3000

