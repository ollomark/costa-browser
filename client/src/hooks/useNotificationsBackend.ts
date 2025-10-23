import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export function useNotificationsBackend() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [deviceId, setDeviceId] = useState<string>('');
  
  const registerDevice = trpc.device.register.useMutation();
  const sendNotification = trpc.notification.send.useMutation();
  const { data: vapidData } = trpc.notification.vapidPublicKey.useQuery();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      // Generate or retrieve device ID
      let storedDeviceId = localStorage.getItem('device-id');
      if (!storedDeviceId) {
        storedDeviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('device-id', storedDeviceId);
      }
      setDeviceId(storedDeviceId);
      
      // Register device on load if notification is enabled
      if (Notification.permission === 'granted') {
        subscribeToPush(storedDeviceId);
      }
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted' && deviceId) {
        // Subscribe to push and register device
        await subscribeToPush(deviceId);
      }
      
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  };

  const sendTestNotification = async (title: string, body: string) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      // Play cash register sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      // Show local notification
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: `notification-${Date.now()}`,
      });

      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  };

  const broadcastNotification = async (title: string, body: string) => {
    try {
      const result = await sendNotification.mutateAsync({ title, body });
      
      // Send local notification to this device
      if (permission === 'granted') {
        await sendTestNotification(title, body);
      }
      
      return result;
    } catch (error) {
      console.error('Failed to broadcast notification:', error);
      return null;
    }
  };

  const subscribeToPush = async (devId: string) => {
    try {
      if (!('serviceWorker' in navigator) || !vapidData?.publicKey) {
        console.warn('[Push] Service worker or VAPID key not available');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe to push
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey),
        });
        console.log('[Push] Subscribed to push notifications');
      }

      // Register device with push subscription
      await registerDevice.mutateAsync({
        deviceId: devId,
        notificationEnabled: true,
        pushSubscription: JSON.stringify(subscription.toJSON()),
        userAgent: navigator.userAgent,
      });
      
      console.log('[Push] Device registered with backend');
    } catch (error) {
      console.error('[Push] Failed to subscribe:', error);
    }
  };

  return {
    permission,
    requestPermission,
    sendTestNotification,
    broadcastNotification,
    isEnabled: permission === 'granted',
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

