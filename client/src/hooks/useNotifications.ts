import { useState, useEffect } from 'react';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationStats {
  totalDevices: number;
  acceptedDevices: number;
  deniedDevices: number;
  lastUpdated: number;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [stats, setStats] = useState<NotificationStats>({
    totalDevices: 0,
    acceptedDevices: 0,
    deniedDevices: 0,
    lastUpdated: Date.now()
  });

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermission(Notification.permission);
      loadStats();
      trackDevice();
    }
  }, []);

  const loadStats = () => {
    const stored = localStorage.getItem("notification-stats");
    if (stored) {
      setStats(JSON.parse(stored));
    }
  };

  const trackDevice = () => {
    const deviceId = getDeviceId();
    const devices = JSON.parse(localStorage.getItem("tracked-devices") || "{}");
    
    if (!devices[deviceId]) {
      devices[deviceId] = {
        id: deviceId,
        firstSeen: Date.now(),
        permission: Notification.permission
      };
    } else {
      devices[deviceId].permission = Notification.permission;
      devices[deviceId].lastSeen = Date.now();
    }
    
    localStorage.setItem("tracked-devices", JSON.stringify(devices));
    updateStats(devices);
  };

  const getDeviceId = () => {
    let deviceId = localStorage.getItem("device-id");
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("device-id", deviceId);
    }
    return deviceId;
  };

  const updateStats = (devices: any) => {
    const deviceList = Object.values(devices) as any[];
    const newStats: NotificationStats = {
      totalDevices: deviceList.length,
      acceptedDevices: deviceList.filter(d => d.permission === "granted").length,
      deniedDevices: deviceList.filter(d => d.permission === "denied").length,
      lastUpdated: Date.now()
    };
    
    setStats(newStats);
    localStorage.setItem("notification-stats", JSON.stringify(newStats));
  };

  const playNotificationSound = () => {
    try {
      // Create a simple cash register "cha-ching" sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First tone (higher pitch - "cha")
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      oscillator1.frequency.value = 800;
      gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.1);

      // Second tone (lower pitch - "ching")
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      oscillator2.frequency.value = 600;
      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.05);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator2.start(audioContext.currentTime + 0.05);
      oscillator2.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.error("Ses çalma hatası:", error);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notifications are not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      trackDevice();
      
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
      return subscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw error;
    }
  };

  const sendTestNotification = async (title: string, body: string, url?: string) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return { success: false, delivered: 0 };
    }

    try {
      // Play cash register sound
      playNotificationSound();

      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `notification-${Date.now()}`,
        requireInteraction: false,
        silent: false,
        data: {
          url: url || '/',
          dateOfArrival: Date.now(),
        },
      } as NotificationOptions);

      // Track delivery
      const deliveryCount = stats.acceptedDevices;
      
      // Save to history
      const notifications = JSON.parse(localStorage.getItem("pwa-browser-notifications") || "[]");
      notifications.unshift({
        id: Date.now().toString(),
        title,
        body,
        timestamp: Date.now(),
        read: false,
        delivered: deliveryCount
      });
      localStorage.setItem("pwa-browser-notifications", JSON.stringify(notifications.slice(0, 50)));

      return { success: true, delivered: deliveryCount };
    } catch (error) {
      console.error('Error showing notification:', error);
      return { success: false, delivered: 0 };
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

  const getStats = () => {
    const devices = JSON.parse(localStorage.getItem("tracked-devices") || "{}");
    updateStats(devices);
    return stats;
  };

  return {
    permission,
    isSupported,
    stats,
    requestPermission,
    sendTestNotification,
    scheduleNotification,
    getStats,
    playNotificationSound
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

