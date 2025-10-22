import { useEffect, useState } from 'react';
import { useNotifications } from './useNotifications';
import { toast } from 'sonner';

const CURRENT_VERSION = '1.5.0';

export function useVersionCheck() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState(CURRENT_VERSION);
  const { sendTestNotification } = useNotifications();

  useEffect(() => {
    checkVersion();
    
    // Check for updates every 30 minutes
    const interval = setInterval(checkVersion, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkVersion = () => {
    // Get version from localStorage (set by admin)
    const storedVersion = localStorage.getItem('app-version');
    
    if (storedVersion && storedVersion !== CURRENT_VERSION) {
      setLatestVersion(storedVersion);
      setHasUpdate(true);
      
      // Show update notification
      showUpdateNotification(storedVersion);
    }
  };

  const showUpdateNotification = async (version: string) => {
    // Check if we've already notified about this version
    const notifiedVersion = localStorage.getItem('notified-version');
    
    if (notifiedVersion === version) {
      return;
    }

    // Send push notification
    await sendTestNotification(
      'Yeni Versiyon Mevcut! 🎉',
      `CostaBrowser ${version} sürümü yayınlandı. Yeni özellikler için sayfayı yenileyin.`
    );

    // Show toast
    toast(`Yeni Versiyon: ${version}`, {
      description: "Yeni özellikler ve iyileştirmeler mevcut",
      duration: 10000,
      action: {
        label: "Güncelle",
        onClick: () => {
          window.location.reload();
        },
      },
    });

    // Mark as notified
    localStorage.setItem('notified-version', version);
  };

  const updateApp = () => {
    window.location.reload();
  };

  return {
    hasUpdate,
    currentVersion: CURRENT_VERSION,
    latestVersion,
    updateApp,
  };
}

