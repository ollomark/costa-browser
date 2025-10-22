import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Send, Bell, RefreshCw, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface SavedSite {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  addedAt: number;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { sendTestNotification } = useNotifications();
  const { isAuthenticated, loading, logout, requireAuth } = useAdminAuth();
  
  // Require authentication
  useEffect(() => {
    requireAuth();
  }, [isAuthenticated, loading]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  const [sites, setSites] = useState<SavedSite[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Site management
  const [editingSite, setEditingSite] = useState<SavedSite | null>(null);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  
  // Notification management
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  
  // Version management
  const [currentVersion, setCurrentVersion] = useState("1.3.0");
  const [newVersion, setNewVersion] = useState("");
  
  // Icon management
  const [iconUrl, setIconUrl] = useState("");
  const [currentIcon, setCurrentIcon] = useState("/icon-192.png");

  useEffect(() => {
    loadSites();
    loadNotifications();
    loadIcon();
  }, []);

  const loadSites = () => {
    const stored = localStorage.getItem("pwa-browser-sites");
    if (stored) {
      setSites(JSON.parse(stored));
    }
  };

  const loadNotifications = () => {
    const stored = localStorage.getItem("pwa-browser-notifications");
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  };
  
  const loadIcon = () => {
    const stored = localStorage.getItem("app-icon");
    if (stored) {
      setCurrentIcon(stored);
    }
  };

  const saveSites = (updatedSites: SavedSite[]) => {
    localStorage.setItem("pwa-browser-sites", JSON.stringify(updatedSites));
    setSites(updatedSites);
    logAction("sites_updated", `Siteler güncellendi (${updatedSites.length} site)`);
    toast.success("Siteler güncellendi");
  };
  
  const logAction = (action: string, description: string) => {
    const logs = JSON.parse(localStorage.getItem("admin-logs") || "[]");
    logs.unshift({
      id: Date.now().toString(),
      action,
      description,
      timestamp: Date.now(),
      username: "admin",
    });
    localStorage.setItem("admin-logs", JSON.stringify(logs.slice(0, 100)));
  };

  const handleAddSite = () => {
    if (!siteTitle || !siteUrl) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    const newSite: SavedSite = {
      id: Date.now().toString(),
      title: siteTitle,
      url: siteUrl,
      favicon: `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`,
      addedAt: Date.now(),
    };

    saveSites([...sites, newSite]);
    setSiteTitle("");
    setSiteUrl("");
  };

  const handleUpdateSite = () => {
    if (!editingSite || !siteTitle || !siteUrl) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    const updatedSites = sites.map(site =>
      site.id === editingSite.id
        ? { ...site, title: siteTitle, url: siteUrl }
        : site
    );

    saveSites(updatedSites);
    setEditingSite(null);
    setSiteTitle("");
    setSiteUrl("");
  };

  const handleDeleteSite = (id: string) => {
    const updatedSites = sites.filter(site => site.id !== id);
    saveSites(updatedSites);
  };

  const handleEditSite = (site: SavedSite) => {
    setEditingSite(site);
    setSiteTitle(site.title);
    setSiteUrl(site.url);
  };

  const handleSendNotification = async () => {
    if (!notifTitle || !notifBody) {
      toast.error("Lütfen başlık ve içerik girin");
      return;
    }

    // Save to history
    const newNotif: Notification = {
      id: Date.now().toString(),
      title: notifTitle,
      body: notifBody,
      timestamp: Date.now(),
      read: false,
    };

    const updatedNotifications = [newNotif, ...notifications];
    localStorage.setItem("pwa-browser-notifications", JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);

    // Send push notification
    await sendTestNotification(notifTitle, notifBody);
    
    logAction("notification_sent", `Bildirim gönderildi: "${notifTitle}"`);
    toast.success("Bildirim gönderildi!");
    setNotifTitle("");
    setNotifBody("");
  };

  const handleVersionUpdate = async () => {
    if (!newVersion) {
      toast.error("Lütfen yeni versiyon numarası girin");
      return;
    }

    localStorage.setItem("app-version", newVersion);
    setCurrentVersion(newVersion);

    // Send update notification
    await sendTestNotification(
      "Yeni Versiyon Mevcut!",
      `CostaBrowser ${newVersion} sürümüne güncellendi. Yeni özellikler için sayfayı yenileyin.`
    );
    
    // Save to notification history
    const newNotif: Notification = {
      id: Date.now().toString(),
      title: "Yeni Versiyon Mevcut!",
      body: `CostaBrowser ${newVersion} sürümüne güncellendi. Yeni özellikler için sayfayı yenileyin.`,
      timestamp: Date.now(),
      read: false,
    };
    const updatedNotifications = [newNotif, ...notifications];
    localStorage.setItem("pwa-browser-notifications", JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);

    logAction("version_updated", `Versiyon ${currentVersion} -> ${newVersion} güncellendi`);
    toast.success(`Versiyon ${newVersion} olarak güncellendi`);
    setNewVersion("");
  };
  
  const handleIconUpdate = () => {
    if (!iconUrl) {
      toast.error("Lütfen icon URL'si girin");
      return;
    }
    
    try {
      new URL(iconUrl); // Validate URL
      localStorage.setItem("app-icon", iconUrl);
      setCurrentIcon(iconUrl);
      
      // Update manifest dynamically
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (link) {
        link.href = iconUrl;
      }
      
      logAction("icon_updated", `Uygulama ikonu güncellendi`);
      toast.success("Icon başarıyla güncellendi!");
      setIconUrl("");
    } catch (error) {
      toast.error("Geçersiz URL formatı");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Site ve bildirim yönetimi</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
          >
            Çıkış Yap
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Icon Management */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Uygulama İkonu</h2>
              <p className="text-sm text-muted-foreground">Uygulama ikonunu özelleştirin</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
              <img
                src={currentIcon}
                alt="Current Icon"
                className="w-16 h-16 rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/icon-192.png";
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Mevcut İkon</p>
                <p className="text-xs text-muted-foreground truncate">{currentIcon}</p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="icon-url">Yeni İkon URL</Label>
              <Input
                id="icon-url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                192x192 veya 512x512 boyutunda PNG formatında olmalı
              </p>
            </div>
            
            <Button
              onClick={handleIconUpdate}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              İkonu Güncelle
            </Button>
          </div>
        </Card>

        {/* Version Management */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Versiyon Yönetimi</h2>
              <p className="text-sm text-muted-foreground">Mevcut: v{currentVersion}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="new-version">Yeni Versiyon</Label>
              <Input
                id="new-version"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="Örn: 1.2.1"
                className="mt-1"
              />
            </div>
            <Button
              onClick={handleVersionUpdate}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Versiyonu Güncelle ve Bildir
            </Button>
          </div>
        </Card>

        {/* Notification Management */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Bildirim Gönder</h2>
              <p className="text-sm text-muted-foreground">Tüm kullanıcılara bildirim</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="notif-title">Başlık</Label>
              <Input
                id="notif-title"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="Bildirim başlığı"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notif-body">İçerik</Label>
              <Textarea
                id="notif-body"
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                placeholder="Bildirim içeriği"
                className="mt-1"
                rows={3}
              />
            </div>
            <Button
              onClick={handleSendNotification}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Bildirim Gönder
            </Button>
          </div>
        </Card>

        {/* Site Management */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Site Yönetimi</h2>
              <p className="text-sm text-muted-foreground">
                {editingSite ? "Site düzenle" : "Yeni site ekle"}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div>
              <Label htmlFor="site-title">Site Adı</Label>
              <Input
                id="site-title"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="Örn: Google"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="site-url">Site URL</Label>
              <Input
                id="site-url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              {editingSite ? (
                <>
                  <Button
                    onClick={handleUpdateSite}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    Güncelle
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSite(null);
                      setSiteTitle("");
                      setSiteUrl("");
                    }}
                    variant="outline"
                  >
                    İptal
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAddSite}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Site Ekle
                </Button>
              )}
            </div>
          </div>

          {/* Sites List */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground mb-2">
              Kayıtlı Siteler ({sites.length})
            </h3>
            {sites.map((site) => (
              <div
                key={site.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
              >
                <img
                  src={site.favicon}
                  alt={site.title}
                  className="w-8 h-8 rounded"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/32";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{site.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{site.url}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditSite(site)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSite(site.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Notification History */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">Bildirim Geçmişi</h2>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Henüz bildirim gönderilmedi
              </p>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notif.timestamp).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{notif.body}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}

