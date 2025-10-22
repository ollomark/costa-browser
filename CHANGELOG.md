# Changelog

All notable changes to CostaBrowser will be documented in this file.

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

