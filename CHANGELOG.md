# Changelog

All notable changes to CostaBrowser will be documented in this file.

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

