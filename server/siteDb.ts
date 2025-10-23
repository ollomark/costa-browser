import { eq } from "drizzle-orm";
import { sites, InsertSite } from "../drizzle/schema";
import { getDb } from "./db";

export async function insertSite(site: InsertSite) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert site: database not available");
    return null;
  }

  try {
    const result = await db.insert(sites).values(site);
    return result;
  } catch (error) {
    console.error("[Database] Failed to insert site:", error);
    throw error;
  }
}

export async function getAllSites() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get sites: database not available");
    return [];
  }

  try {
    const result = await db.select().from(sites);
    console.log('[Database] getAllSites result:', result);
    return result;
  } catch (error) {
    console.error('[Database] Failed to get sites:', error);
    return [];
  }
}

export async function getSite(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get site: database not available");
    return undefined;
  }

  const result = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSite(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete site: database not available");
    return;
  }

  try {
    await db.delete(sites).where(eq(sites.id, id));
  } catch (error) {
    console.error("[Database] Failed to delete site:", error);
    throw error;
  }
}

export async function updateSite(id: number, site: Partial<InsertSite>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update site: database not available");
    return;
  }

  try {
    await db.update(sites).set(site).where(eq(sites.id, id));
  } catch (error) {
    console.error("[Database] Failed to update site:", error);
    throw error;
  }
}

