import { eq } from "drizzle-orm";
import { versions, InsertVersion } from "../drizzle/schema";
import { getDb } from "./db";

export async function insertVersion(version: InsertVersion) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot insert version: database not available");
    return null;
  }

  try {
    // Set all versions to not current
    await db.update(versions).set({ isCurrent: 0 });
    
    // Insert new version as current
    const result = await db.insert(versions).values({
      ...version,
      isCurrent: 1,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to insert version:", error);
    throw error;
  }
}

export async function getCurrentVersion() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get current version: database not available");
    return null;
  }

  const result = await db
    .select()
    .from(versions)
    .where(eq(versions.isCurrent, 1))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getAllVersions() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get versions: database not available");
    return [];
  }

  return await db.select().from(versions).orderBy(versions.releasedAt);
}

