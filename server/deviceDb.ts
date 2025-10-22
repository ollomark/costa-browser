import { eq } from "drizzle-orm";
import { devices, notifications, InsertDevice, InsertNotification } from "../drizzle/schema";
import { getDb } from "./db";

export async function upsertDevice(device: InsertDevice) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert device: database not available");
    return;
  }

  try {
    await db
      .insert(devices)
      .values({
        ...device,
        lastSeen: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          notificationEnabled: device.notificationEnabled,
          userAgent: device.userAgent,
          lastSeen: new Date(),
        },
      });
  } catch (error) {
    console.error("[Database] Failed to upsert device:", error);
    throw error;
  }
}

export async function getDevice(deviceId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get device: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(devices)
    .where(eq(devices.deviceId, deviceId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDevices() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get devices: database not available");
    return [];
  }

  return await db.select().from(devices);
}

export async function getDeviceStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get device stats: database not available");
    return { totalDevices: 0, notificationEnabled: 0, notificationDisabled: 0 };
  }

  const allDevices = await db.select().from(devices);
  
  return {
    totalDevices: allDevices.length,
    notificationEnabled: allDevices.filter(d => d.notificationEnabled === 1).length,
    notificationDisabled: allDevices.filter(d => d.notificationEnabled === 0).length,
  };
}

export async function insertNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert notification: database not available");
    return null;
  }

  try {
    const result = await db.insert(notifications).values(notification);
    return result;
  } catch (error) {
    console.error("[Database] Failed to insert notification:", error);
    throw error;
  }
}

export async function getNotifications(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get notifications: database not available");
    return [];
  }

  return await db
    .select()
    .from(notifications)
    .orderBy(notifications.sentAt)
    .limit(limit);
}

