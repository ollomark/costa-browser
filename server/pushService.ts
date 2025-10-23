import webpush from 'web-push';

// VAPID keys - production'da environment variable'dan alınmalı
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BH4B-BynKq0cPnAJHnoWhkSvlWxct50goqf2LjrvIv9ZEx43FFFwNURGihla76q4OXwW46QGH9aql9tMluVIYEs';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'BLDxgceCN0m6WD2M4n_kNfBmtUZXY2ZLZUC1fVk2ecw';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@costabrowser.com';

// Configure web-push
webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
}

/**
 * Send push notification to a single device
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushNotificationPayload
): Promise<boolean> {
  try {
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      badge: payload.badge || '/icon-192.png',
      url: payload.url || '/',
      timestamp: Date.now(),
    });

    await webpush.sendNotification(subscription, notificationPayload);
    console.log('[Push] Notification sent successfully');
    return true;
  } catch (error: any) {
    console.error('[Push] Error sending notification:', error);
    
    // Handle subscription errors
    if (error.statusCode === 410 || error.statusCode === 404) {
      console.log('[Push] Subscription expired or invalid');
      return false;
    }
    
    throw error;
  }
}

/**
 * Send push notification to multiple devices
 */
export async function sendPushNotificationToDevices(
  subscriptions: PushSubscription[],
  payload: PushNotificationPayload
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  const results = await Promise.allSettled(
    subscriptions.map(sub => sendPushNotification(sub, payload))
  );

  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value) {
      success++;
    } else {
      failed++;
      console.error(`[Push] Failed to send to device ${index}:`, result);
    }
  });

  console.log(`[Push] Sent ${success}/${subscriptions.length} notifications`);
  return { success, failed };
}

/**
 * Get VAPID public key for client-side subscription
 */
export function getVapidPublicKey(): string {
  return VAPID_PUBLIC_KEY;
}

