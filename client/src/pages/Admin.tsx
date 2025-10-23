import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Send, Bell, RefreshCw, Edit, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AdminLoginGuard } from "@/components/AdminLoginGuard";
import { SiteDrawer } from "@/components/SiteDrawer";

interface SavedSite {
  id: number;
  url: string;
  title: string;
  favicon?: string | null;
  addedAt: Date;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  
  // tRPC queries and mutations
  const { data: sites, refetch: refetchSites } = trpc.site.list.useQuery();
  const { data: deviceStats } = trpc.device.stats.useQuery();
  const { data: versionData } = trpc.version.current.useQuery();
  const { data: notifications } = trpc.notification.history.useQuery();
  const { data: iconData } = trpc.icon.get.useQuery();
  
  const addSiteMutation = trpc.site.add.useMutation();
  const updateSiteMutation = trpc.site.update.useMutation();
  const deleteSiteMutation = trpc.site.delete.useMutation();
  const sendNotificationMutation = trpc.notification.send.useMutation();
  const updateVersionMutation = trpc.version.update.useMutation();
  const updateIconMutation = trpc.icon.update.useMutation();
  
  // Site management
  const [editingSite, setEditingSite] = useState<SavedSite | null>(null);
  const [siteTitle, setSiteTitle] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  
  // Notification management
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");
  
  // Version management
  const currentVersion = versionData?.version || "1.7.0";
  const [newVersion, setNewVersion] = useState("");
  
  // Icon management
  const [newIconUrl, setNewIconUrl] = useState("");
  
  // Notification delivery tracking
  const [lastDeliveryCount, setLastDeliveryCount] = useState(0);

  const handleAddSite = async () => {
    if (!siteTitle || !siteUrl) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      await addSiteMutation.mutateAsync({
        title: siteTitle,
        url: siteUrl,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`,
      });
      
      toast.success("Site başarıyla eklendi!");
      setSiteTitle("");
      setSiteUrl("");
      refetchSites();
    } catch (error) {
      toast.error("Site eklenemedi!");
      console.error(error);
    }
  };

  const handleUpdateSite = async () => {
    if (!editingSite || !siteTitle || !siteUrl) {
      toast.error("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      await updateSiteMutation.mutateAsync({
        id: editingSite.id,
        title: siteTitle,
        url: siteUrl,
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(siteUrl).hostname}&sz=64`,
      });
      
      toast.success("Site başarıyla güncellendi!");
      setEditingSite(null);
      setSiteTitle("");
      setSiteUrl("");
      refetchSites();
    } catch (error) {
      toast.error("Site güncellenemedi!");
      console.error(error);
    }
  };

  const handleDeleteSite = async (id: number) => {
    try {
      await deleteSiteMutation.mutateAsync({ id });
      toast.success("Site silindi!");
      refetchSites();
    } catch (error) {
      toast.error("Site silinemedi!");
      console.error(error);
    }
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

    try {
      const result = await sendNotificationMutation.mutateAsync({
        title: notifTitle,
        body: notifBody,
      });
      
      setLastDeliveryCount(result.deliveredCount);
      toast.success(`Bildirim gönderildi! ${result.deliveredCount} cihaza ulaştı.`);
      setNotifTitle("");
      setNotifBody("");
    } catch (error) {
      toast.error("Bildirim gönderilemedi!");
      console.error(error);
    }
  };

  const handleVersionUpdate = async () => {
    if (!newVersion) {
      toast.error("Lütfen yeni versiyon numarası girin");
      return;
    }

    try {
      const result = await updateVersionMutation.mutateAsync({
        version: newVersion,
      });

      toast.success(`Versiyon ${newVersion} olarak güncellendi! ${result.notificationsSent} cihaza bildirim gönderildi.`);
      setNewVersion("");
    } catch (error) {
      toast.error("Versiyon güncellenemedi");
      console.error(error);
    }
  };

  const handleIconUpdate = async () => {
    if (!newIconUrl) {
      toast.error("Lütfen ikon URL'i girin");
      return;
    }

    try {
      await updateIconMutation.mutateAsync({ iconUrl: newIconUrl });
      toast.success("İkon başarıyla güncellendi!");
      setNewIconUrl("");
    } catch (error) {
      toast.error("İkon güncellenemedi!");
      console.error(error);
    }
  };

  return (
    <AdminLoginGuard>
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
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Site ve bildirim yönetimi</p>
          </div>
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

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
              <img 
                src={iconData?.iconUrl || "/icon-192.png"} 
                alt="Current Icon"
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">Mevcut İkon</p>
                <p className="text-xs text-muted-foreground">{iconData?.iconUrl || "/icon-192.png"}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="icon-url">Yeni İkon URL</Label>
              <Input
                id="icon-url"
                value={newIconUrl}
                onChange={(e) => setNewIconUrl(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                192x192 veya 512x512 boyutlarında PNG formatında olmalı
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
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Bildirim Gönder</h2>
              <p className="text-sm text-muted-foreground">Tüm kullanıcılara bildirim</p>
            </div>
          </div>
          
          {/* Notification Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{deviceStats?.totalDevices || 0}</p>
              <p className="text-xs text-muted-foreground">Toplam Cihaz</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{deviceStats?.notificationEnabled || 0}</p>
              <p className="text-xs text-muted-foreground">Bildirim Açık</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{deviceStats?.notificationDisabled || 0}</p>
              <p className="text-xs text-muted-foreground">Bildirim Kapalı</p>
            </div>
          </div>
          
          {lastDeliveryCount > 0 && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <p className="text-sm text-emerald-400">
                ✅ Son bildirim <strong>{lastDeliveryCount} cihaza</strong> ulaştı
              </p>
            </div>
          )}

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
              <p className="text-sm text-muted-foreground">Yeni site ekle</p>
            </div>
          </div>

          <div className="space-y-3">
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
            <Button
              onClick={editingSite ? handleUpdateSite : handleAddSite}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {editingSite ? "Siteyi Güncelle" : "Site Ekle"}
            </Button>
            {editingSite && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingSite(null);
                  setSiteTitle("");
                  setSiteUrl("");
                }}
                className="w-full"
              >
                İptal
              </Button>
            )}
          </div>

          {/* Sites List */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Kayıtlı Siteler ({sites?.length || 0})</h3>
            <div className="space-y-2">
              {sites?.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <img
                    src={site.favicon || "/icon-192.png"}
                    alt={site.title}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{site.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{site.url}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditSite(site)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Notification History */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-4">Bildirim Geçmişi</h2>
          <div className="space-y-2">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <p className="font-medium">{notif.title}</p>
                  <p className="text-sm text-muted-foreground">{notif.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notif.sentAt).toLocaleString('tr-TR')} • {notif.deviceCount} cihaz
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Henüz bildirim gönderilmedi
              </p>
            )}
          </div>
        </Card>
      </main>
    </div>
    </AdminLoginGuard>
  );
}

