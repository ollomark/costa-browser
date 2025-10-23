# 🌐 CostaBrowser

**Native PWA Browser** - Web sitelerinizi uygulama gibi kullanın!

CostaBrowser, favori web sitelerinizi native uygulama deneyimiyle kullanmanızı sağlayan modern bir Progressive Web Application (PWA) tarayıcısıdır.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ollomark/costa-browser)

## ✨ Özellikler

### 🎯 Temel Özellikler
- **Native Uygulama Deneyimi**: Web sitelerini tam ekran, uygulama gibi kullanın
- **Offline Çalışma**: Service Worker ile offline destek
- **Push Bildirimleri**: Kullanıcılara anlık bildirim gönderme
- **Ana Ekrana Ekle**: PWA olarak telefon/bilgisayara yüklenebilir
- **Karanlık/Aydınlık Tema**: Otomatik tema değiştirme

### 🔧 Admin Panel
- **Site Yönetimi**: Siteleri ekle, düzenle, sil
- **Bildirim Sistemi**: Tüm kullanıcılara toplu bildirim gönder
- **Cihaz İstatistikleri**: Kayıtlı cihaz sayısı ve bildirim durumları
- **Versiyon Yönetimi**: Uygulama versiyonunu güncelle ve kullanıcılara bildir
- **İkon Özelleştirme**: Uygulama ikonunu değiştir

### 🛠️ Teknik Özellikler
- **Modern Stack**: React 19, TypeScript, Tailwind CSS 4
- **Backend**: Express.js + tRPC
- **Database**: MySQL/TiDB (Railway/Heroku JawsDB uyumlu)
- **ORM**: Drizzle ORM
- **Build Tool**: Vite + esbuild
- **Package Manager**: pnpm

## 🚀 Hızlı Başlangıç

### Heroku'ya Deploy Et

En hızlı yol! Tek tıkla Heroku'ya deploy edin:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ollomark/costa-browser)

**Not:** Heroku deployment otomatik olarak:
- JawsDB MySQL database ekler
- Environment variable'ları ayarlar
- Database migration'ları çalıştırır
- Uygulamayı başlatır

### Manuel Kurulum

#### Gereksinimler
- Node.js 18+
- pnpm 8+
- MySQL/TiDB database

#### Adımlar

1. **Repository'yi klonlayın**
```bash
git clone https://github.com/ollomark/costa-browser.git
cd costa-browser
```

2. **Bağımlılıkları yükleyin**
```bash
pnpm install
```

3. **Environment variable'ları ayarlayın**

`.env` dosyası oluşturun:
```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret
JWT_SECRET=your-secret-key-here

# App Config
VITE_APP_TITLE=CostaBrowser
VITE_APP_LOGO=/icon-192.png
NODE_ENV=development
PORT=3000
```

4. **Database migration'ları çalıştırın**
```bash
pnpm db:push
```

5. **Development server'ı başlatın**
```bash
pnpm dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

### Production Build

```bash
# Build
pnpm build

# Start production server
pnpm start
```

## 📱 Kullanım

### Kullanıcı Tarafı

1. **Site Ekleme**: Ana sayfada "Yeni Site Ekle" butonuna tıklayın
2. **Site Açma**: Eklenen sitelere tıklayarak tam ekran modda açın
3. **Bildirimler**: İzin vererek push bildirimleri alın
4. **Ana Ekrana Ekle**: Tarayıcı menüsünden "Ana ekrana ekle" seçeneğini kullanın

### Admin Tarafı

1. **Admin Panel**: `/admin` adresine gidin
2. **Giriş**: Varsayılan şifre: `costa2025`
3. **Site Yönetimi**: Siteleri ekle, düzenle, sil
4. **Bildirim Gönder**: Tüm kullanıcılara bildirim gönderin
5. **Versiyon Güncelle**: Yeni versiyon yayınlayın

## 🗄️ Database Şeması

### Sites
- `id`: Primary key
- `url`: Site URL'i
- `title`: Site adı
- `favicon`: Favicon URL'i
- `addedAt`: Eklenme tarihi

### Devices
- `id`: Primary key
- `endpoint`: Push notification endpoint
- `p256dh`: Encryption key
- `auth`: Auth key
- `notificationsEnabled`: Bildirim durumu
- `registeredAt`: Kayıt tarihi

### Notifications
- `id`: Primary key
- `title`: Bildirim başlığı
- `body`: Bildirim içeriği
- `deviceCount`: Gönderilen cihaz sayısı
- `sentAt`: Gönderim tarihi

### Version
- `id`: Primary key
- `version`: Versiyon numarası
- `updatedAt`: Güncelleme tarihi

### Icon
- `id`: Primary key
- `iconUrl`: İkon URL'i
- `updatedAt`: Güncelleme tarihi

## 🔐 Güvenlik

- Admin panel şifre korumalı
- JWT token ile authentication
- HTTPS zorunlu (production)
- Environment variable'lar ile hassas bilgi yönetimi
- SQL injection koruması (Drizzle ORM)

## 🌍 Environment Variables

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `VITE_APP_TITLE` | Uygulama başlığı | CostaBrowser |
| `VITE_APP_LOGO` | Logo URL'i | /icon-192.png |
| `OAUTH_SERVER_URL` | OAuth server URL (opsiyonel) | - |

## 📦 Deployment

### Heroku

```bash
# Heroku CLI ile deploy
heroku create your-app-name
heroku addons:create jawsdb:kitefin
git push heroku main
```

### Railway

```bash
# Railway CLI ile deploy
railway init
railway add
railway up
```

### Docker

```bash
# Docker image build
docker build -t costa-browser .

# Container çalıştır
docker run -p 3000:3000 --env-file .env costa-browser
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📞 İletişim

- GitHub: [@ollomark](https://github.com/ollomark)
- Repository: [costa-browser](https://github.com/ollomark/costa-browser)

---

**CostaBrowser** ile web sitelerinizi native uygulama deneyimiyle kullanın! 🚀

