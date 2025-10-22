import { useEffect } from 'react';
import { useNotifications } from './useNotifications';

const REMINDER_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useAppReminder() {
  const { sendTestNotification, permission } = useNotifications();

  useEffect(() => {
    // Check if reminders are enabled
    const remindersEnabled = localStorage.getItem('reminders-enabled');
    
    if (remindersEnabled !== 'true' || permission !== 'granted') {
      return;
    }

    // Set up interval for reminders
    const intervalId = setInterval(() => {
      sendReminder();
    }, REMINDER_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [permission]);

  const sendReminder = async () => {
    const messages = [
      {
        title: "CostaBrowser Hatırlatıcı",
        body: "Favori sitelerinizi ziyaret etmeyi unutmayın! 🌐",
      },
      {
        title: "Yeni İçerikler Sizi Bekliyor",
        body: "Kayıtlı sitelerinizde yeni içerikler olabilir. Göz atın! 👀",
      },
      {
        title: "CostaBrowser ile Bağlantıda Kalın",
        body: "Web sitelerinize hızlı erişim için CostaBrowser'ı kullanın! ⚡",
      },
      {
        title: "Ara Verme Zamanı",
        body: "Biraz mola verin ve favori sitelerinize göz atın! ☕",
      },
    ];

    // Pick a random message
    const message = messages[Math.floor(Math.random() * messages.length)];

    await sendTestNotification(message.title, message.body);

    // Save to notification history
    const notifications = JSON.parse(localStorage.getItem('pwa-browser-notifications') || '[]');
    notifications.unshift({
      id: Date.now().toString(),
      title: message.title,
      body: message.body,
      timestamp: Date.now(),
      read: false,
    });
    localStorage.setItem('pwa-browser-notifications', JSON.stringify(notifications));
  };

  const enableReminders = () => {
    localStorage.setItem('reminders-enabled', 'true');
  };

  const disableReminders = () => {
    localStorage.setItem('reminders-enabled', 'false');
  };

  const isEnabled = () => {
    return localStorage.getItem('reminders-enabled') === 'true';
  };

  return {
    enableReminders,
    disableReminders,
    isEnabled,
  };
}

