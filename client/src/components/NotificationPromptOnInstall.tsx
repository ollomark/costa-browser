import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export function NotificationPromptOnInstall() {
  const { permission, isSupported, requestPermission } = useNotifications();
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    // Check if app is running in standalone mode (added to home screen)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isIOSStandalone;

    // Check if we've already prompted
    const promptedBefore = localStorage.getItem('notification-prompt-shown');

    if (isInstalled && !hasPrompted && !promptedBefore && isSupported && permission === 'default') {
      // Wait a bit before showing the prompt (better UX)
      const timer = setTimeout(() => {
        showNotificationPrompt();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [permission, isSupported, hasPrompted]);

  const showNotificationPrompt = async () => {
    setHasPrompted(true);
    localStorage.setItem('notification-prompt-shown', 'true');

    // Show a toast notification asking for permission
    toast(
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Bildirimlere İzin Ver</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Önemli güncellemelerden haberdar olmak için bildirimlere izin verin.
          </p>
        </div>
      </div>,
      {
        duration: 10000,
        action: {
          label: "İzin Ver",
          onClick: async () => {
            const granted = await requestPermission();
            if (granted) {
              toast.success("Bildirimler etkinleştirildi! 🎉");
            } else {
              toast.error("Bildirim izni reddedildi");
            }
          },
        },
        cancel: {
          label: "Şimdi Değil",
          onClick: () => {
            toast.info("Bildirimleri daha sonra ayarlardan açabilirsiniz");
          },
        },
      }
    );
  };

  return null;
}

