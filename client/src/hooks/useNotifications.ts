import { useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications are not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Subscribe to push notifications
        await subscribeToPush();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Already subscribed to push notifications');
        return existingSubscription;
      }

      // For demo purposes, we're using a public VAPID key
      // In production, you should generate your own VAPID keys
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrZJbZvTQLpqVwvZJNvMwJzDGCzDPWdDsWOvqDGLVWLbTWvPqVE'
        ),
      });

      console.log('Push subscription:', subscription);
      
      // In production, send this subscription to your server
      // await fetch('/api/subscribe', {
      //   method: 'POST',
      //   body: JSON.stringify(subscription),
      //   headers: { 'Content-Type': 'application/json' }
      // });

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    }
  };

  const sendTestNotification = async (title: string, body: string, url?: string) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'pwa-browser-notification',
        requireInteraction: false,
        data: {
          url: url || '/',
          dateOfArrival: Date.now(),
        },
      } as NotificationOptions);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const scheduleNotification = async (
    title: string,
    body: string,
    delayMs: number,
    url?: string
  ) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    setTimeout(() => {
      sendTestNotification(title, body, url);
    }, delayMs);
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendTestNotification,
    scheduleNotification,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

