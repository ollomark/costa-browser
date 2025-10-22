import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SiteNotificationSettingsProps {
  siteId: string;
  siteName: string;
}

interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string;
}

export function SiteNotificationSettings({ siteId, siteName }: SiteNotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    dailyReminder: false,
    reminderTime: "09:00",
  });

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem(`notification-settings-${siteId}`);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load notification settings", e);
      }
    }
  }, [siteId]);

  const saveSettings = (newSettings: NotificationSettings) => {
    localStorage.setItem(`notification-settings-${siteId}`, JSON.stringify(newSettings));
    setSettings(newSettings);
  };

  const handleToggleEnabled = (checked: boolean) => {
    const newSettings = { ...settings, enabled: checked };
    saveSettings(newSettings);
    
    if (checked) {
      toast.success(`${siteName} için bildirimler etkinleştirildi`);
    } else {
      toast.info(`${siteName} için bildirimler kapatıldı`);
    }
  };

  const handleToggleDailyReminder = (checked: boolean) => {
    const newSettings = { ...settings, dailyReminder: checked };
    saveSettings(newSettings);
    
    if (checked) {
      toast.success("Günlük hatırlatıcı ayarlandı");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bildirim Ayarları</DialogTitle>
          <DialogDescription>
            {siteName} için bildirim tercihlerinizi yönetin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enable-notifications">Bildirimleri Etkinleştir</Label>
              <p className="text-sm text-muted-foreground">
                Bu site için bildirim al
              </p>
            </div>
            <Switch
              id="enable-notifications"
              checked={settings.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>

          {settings.enabled && (
            <>
              <div className="h-px bg-border" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-reminder">Günlük Hatırlatıcı</Label>
                  <p className="text-sm text-muted-foreground">
                    Her gün bu siteyi ziyaret et hatırlatması
                  </p>
                </div>
                <Switch
                  id="daily-reminder"
                  checked={settings.dailyReminder}
                  onCheckedChange={handleToggleDailyReminder}
                />
              </div>

              {settings.dailyReminder && (
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Hatırlatıcı Saati</Label>
                  <input
                    id="reminder-time"
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => {
                      const newSettings = { ...settings, reminderTime: e.target.value };
                      saveSettings(newSettings);
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

