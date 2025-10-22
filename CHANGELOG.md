# Changelog

All notable changes to CostaBrowser will be documented in this file.

## [1.3.0] - 2025-01-22

### Added
- **Admin Login Sistemi**: Güvenli admin paneli erişimi
  - Kullanıcı adı ve şifre ile giriş (admin/costa2025)
  - 24 saatlik oturum süresi
  - Otomatik oturum kontrolü
  - `/admin/login` route'u ile erişilebilir

- **Admin Loglama**: Tüm admin işlemlerinin kaydı
  - Site ekleme/silme/güncelleme logları
  - Bildirim gönderme logları
  - Versiyon güncelleme logları
  - Icon değiştirme logları
  - Son 100 log kaydı tutulur

- **Otomatik Güncelleme Bildirimi**: Versiyon değişikliklerinde otomatik bildirim
  - Admin panelden versiyon güncellendiğinde push notification
  - Bildirim merkezi geçmişine otomatik kayıt
  - 30 dakikada bir otomatik versiyon kontrolü
  - Toast notification ile güncelleme seçeneği

- **5 Dakikalık Hatırlatıcılar**: Periyodik uygulama hatırlatıcıları
  - Ayarlardan etkinleştirilebilir/kapatılabilir
  - Her 5 dakikada bir rastgele hatırlatıcı mesajı
  - 4 farklı hatırlatıcı mesajı
  - Bildirim geçmişine otomatik kayıt

- **Icon Özelleştirme**: Admin panelden uygulama ikonu değiştirme
  - URL ile yeni icon yükleme
  - Mevcut icon önizlemesi
  - Dinamik favicon güncelleme
  - 192x192 veya 512x512 boyut desteği

### Changed
- Admin panel artık login gerektiriyor
- Versiyon numarası 1.2.0 → 1.3.0
- Footer'da versiyon bilgisi 1.3.0 olarak güncellendi
- Tüm admin işlemleri loglanıyor

### Security
- Admin paneline erişim için authentication eklendi
- Session-based oturum yönetimi
- Otomatik oturum sona erme (24 saat)
- Başarısız giriş denemeleri loglanıyor

### Technical Details
- New pages: `AdminLogin.tsx`
- New hooks: `useAdminAuth.ts`, `useAppReminder.ts`
- Enhanced: `useVersionCheck.ts` (auto notification)
- Admin session management with localStorage
- Admin action logging system (last 100 logs)
- 5-minute interval reminder system
- Dynamic icon update functionality

---

## [1.2.0] - 2025-01-22

### Added
- **Admin Panel**: Dinamik site ve bildirim yönetimi
  - Site ekleme, düzenleme ve silme
  - Tüm kullanıcılara bildirim gönderme
  - Versiyon güncelleme ve otomatik bildirim
  - Bildirim geçmişi görüntüleme
  - `/admin` route'u ile erişilebilir

- **Bildirim Merkezi**: Geçmiş bildirimleri görüntüleme
  - Tüm bildirimlerin listesi
  - Okundu/okunmadı durumu
  - Bildirimleri silme ve temizleme
  - Header'da bildirim sayacı (badge)
  - `/notifications` route'u ile erişilebilir

- **Versiyon Kontrolü**: Otomatik güncelleme sistemi
  - Admin panelden versiyon güncelleme
  - Otomatik güncelleme bildirimi (push + toast)
  - 30 dakikada bir otomatik kontrol
  - Kullanıcıya güncelleme seçeneği sunma

- **Modal Site Ekleme**: Drawer (aşağıdan açılan modal)
  - Modern drawer UI ile site ekleme
  - Aşağı sürükleyerek kapatma
  - Daha iyi mobil deneyim
  - Otomatik favicon çekme

- **Versiyon Bilgisi**: Footer'da versiyon gösterimi
  - Mevcut versiyon numarası
  - Admin panel linkı
  - Kolay erişim

### Changed
- Site ekleme butonu drawer olarak yeniden tasarlandı
- Header'a bildirim zili ikonu eklendi (okunmamış sayısı ile)
- Footer tasarımı güncellendi (versiyon + admin link)
- Bildirimler artık localStorage'da saklanıyor

### Technical Details
- Version: 1.1.0 → 1.2.0
- New pages: `Admin.tsx`, `Notifications.tsx`
- New components: `AddSiteDrawer.tsx`
- New hooks: `useVersionCheck.ts`
- New routes: `/admin`, `/notifications`
- Enhanced notification system with history
- Automatic version checking (30 min interval)

---

## [1.1.0] - 2025-01-22

### Added
- **Varsayılan Site**: Uygulama ilk açıldığında "casicosta" sitesi otomatik olarak eklenir
  - URL: https://www.casicostaortaklik.com/r/Sosyal
- **Ana Ekran Bildirim İstemi**: Uygulama ana ekrana eklendikten sonra otomatik olarak bildirim izni istenir
  - 2 saniye gecikme ile kullanıcı dostu şekilde gösterilir
  - Toast notification ile "İzin Ver" ve "Şimdi Değil" seçenekleri
  - Sadece bir kez gösterilir (localStorage ile takip edilir)

### Changed
- **Uygulama Adı**: "PWA Browser" → "CostaBrowser"
  - Tüm UI elementlerinde güncellendi
  - Manifest.json güncellendi
  - Service Worker bildirimleri güncellendi
  - Package.json güncellendi

### Technical Details
- Version: 1.0.0 → 1.1.0
- New hooks: `useInitialSites`
- New components: `NotificationPromptOnInstall`
- Standalone mode detection (iOS ve Android)
- LocalStorage initialization flag

---

## [1.0.0] - 2025-01-22

### Initial Release
- Progressive Web App (PWA) functionality
- Site management (add, remove, view)
- Internal site viewer with iframe
- External browser option
- Service Worker for offline support
- Install prompt for home screen
- Dark/Light theme support
- Push notifications support (iOS 16.4+)
- Notification settings per site
- Daily reminder feature
- Responsive design
- Emerald-Cyan gradient UI theme

