import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/useNotifications";
import { ArrowLeft, Bell, BellOff, Send } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { permission, isSupported, requestPermission, sendTestNotification } = useNotifications();
  const [testTitle, setTestTitle] = useState("PWA Browser");
  const [testBody, setTestBody] = useState("Bu bir test bildirimidir!");
  const [isEnabled, setIsEnabled] = useState(permission === 'granted');

  const handleToggleNotifications = async (checked: boolean) => {
    if (checked && permission !== 'granted') {
      const granted = await requestPermission();
      setIsEnabled(granted);
      if (granted) {
        toast.success("Bildirimler etkinleştirildi!");
      } else {
        toast.error("Bildirim izni reddedildi");
      }
    } else {
      setIsEnabled(checked);
    }
  };

  const handleSendTest = async () => {
    if (permission !== 'granted') {
      toast.error("Önce bildirim izni vermelisiniz");
      return;
    }

    await sendTestNotification(testTitle, testBody);
    toast.success("Test bildirimi gönderildi!");
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
          <div>
            <h1 className="text-xl font-bold">Ayarlar</h1>
            <p className="text-xs text-muted-foreground">Bildirim ve uygulama ayarları</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Notifications Section */}
        <Card className="p-6 mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Bildirimler</h2>
              <p className="text-sm text-muted-foreground">
                Push bildirim ayarlarını yönetin
              </p>
            </div>
          </div>

          {!isSupported ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-3">
                <BellOff className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-destructive mb-1">
                    Bildirimler Desteklenmiyor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tarayıcınız veya cihazınız push bildirimleri desteklemiyor.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <Label htmlFor="notifications-toggle" className="text-base font-medium cursor-pointer">
                    Bildirimleri Etkinleştir
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {permission === 'granted' 
                      ? 'Bildirimler aktif' 
                      : permission === 'denied'
                      ? 'Bildirim izni reddedildi. Tarayıcı ayarlarından izin verin.'
                      : 'Bildirim almak için izin verin'}
                  </p>
                </div>
                <Switch
                  id="notifications-toggle"
                  checked={isEnabled}
                  onCheckedChange={handleToggleNotifications}
                  disabled={permission === 'denied'}
                />
              </div>

              {/* Permission Status */}
              <div className="p-4 rounded-lg border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">İzin Durumu</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    permission === 'granted' 
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : permission === 'denied'
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {permission === 'granted' ? 'İzin Verildi' : permission === 'denied' ? 'Reddedildi' : 'Bekliyor'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {permission === 'denied' && 
                    'Tarayıcı ayarlarından bu site için bildirim iznini açmanız gerekiyor.'}
                  {permission === 'default' && 
                    'Bildirimleri etkinleştirdiğinizde izin istemi görünecek.'}
                  {permission === 'granted' && 
                    'Artık bildirim alabilirsiniz.'}
                </p>
              </div>

              {/* Test Notification */}
              {permission === 'granted' && (
                <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Test Bildirimi Gönder
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-title" className="text-sm">Başlık</Label>
                      <Input
                        id="test-title"
                        value={testTitle}
                        onChange={(e) => setTestTitle(e.target.value)}
                        placeholder="Bildirim başlığı"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="test-body" className="text-sm">İçerik</Label>
                      <Input
                        id="test-body"
                        value={testBody}
                        onChange={(e) => setTestBody(e.target.value)}
                        placeholder="Bildirim içeriği"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={handleSendTest}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Test Bildirimi Gönder
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* iOS Specific Instructions */}
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">iOS Bildirimleri</h2>
              <p className="text-sm text-muted-foreground">iOS 16.4+ gereklidir</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              iOS cihazlarda bildirim almak için uygulamanın ana ekrana eklenmesi gerekir:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
              <li>Safari'de bu sayfayı açın</li>
              <li>Paylaş butonuna (⬆️) tıklayın</li>
              <li>"Ana Ekrana Ekle" seçeneğini seçin</li>
              <li>Ana ekrandan uygulamayı açın</li>
              <li>Ayarlar'dan bildirimleri etkinleştirin</li>
            </ol>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mt-4">
              <p className="text-xs text-blue-400">
                💡 <strong>Not:</strong> iOS'ta bildirimler sadece ana ekrana eklenmiş PWA'larda çalışır.
                Web tarayıcısında çalışmaz.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

