import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc';

export function useNotificationsBackend() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [deviceId, setDeviceId] = useState<string>('');
  
  const registerDevice = trpc.device.register.useMutation();
  const sendNotification = trpc.notification.send.useMutation();

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
        registerDevice.mutate({
          deviceId: storedDeviceId,
          notificationsEnabled: true,
          userAgent: navigator.userAgent,
        });
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
        // Register device with backend
        await registerDevice.mutateAsync({
          deviceId,
          notificationsEnabled: true,
          userAgent: navigator.userAgent,
        });
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

  return {
    permission,
    requestPermission,
    sendTestNotification,
    broadcastNotification,
    isEnabled: permission === 'granted',
  };
}

