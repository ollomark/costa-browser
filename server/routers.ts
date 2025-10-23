import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { upsertDevice, getDeviceStats, insertNotification, getAllDevices, getNotifications } from "./deviceDb";
import { insertSite, getAllSites, getSite, deleteSite, updateSite } from "./siteDb";
import { insertVersion, getCurrentVersion, getAllVersions } from "./versionDb";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  device: router({
    register: publicProcedure
      .input(
        z.object({
          deviceId: z.string(),
          notificationEnabled: z.boolean(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await upsertDevice({
          deviceId: input.deviceId,
          notificationEnabled: input.notificationEnabled ? 1 : 0,
          userAgent: input.userAgent,
        });
        return { success: true };
      }),

    stats: publicProcedure.query(async () => {
      return await getDeviceStats();
    }),
  }),

  notification: router({
    history: publicProcedure.query(async () => {
      return await getNotifications(50);
    }),

    send: publicProcedure
      .input(
        z.object({
          title: z.string(),
          body: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Get all devices with notifications enabled
        const devices = await getAllDevices();
        const enabledDevices = devices.filter((d) => d.notificationEnabled === 1);

        // Store notification in database
        await insertNotification({
          title: input.title,
          body: input.body,
          deliveredCount: enabledDevices.length,
        });

        return {
          success: true,
          deliveredCount: enabledDevices.length,
          deviceIds: enabledDevices.map((d) => d.deviceId),
        };
      }),
  }),

  site: router({
    list: publicProcedure.query(async () => {
      return await getAllSites();
    }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getSite(input.id);
      }),

    add: publicProcedure
      .input(
        z.object({
          url: z.string(),
          title: z.string(),
          favicon: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await insertSite(input);
        
        // Send notification to all devices
        const devices = await getAllDevices();
        const enabledDevices = devices.filter((d) => d.notificationEnabled === 1);
        
        await insertNotification({
          title: "Yeni Site Eklendi! 🎉",
          body: `${input.title} başarıyla eklendi`,
          deliveredCount: enabledDevices.length,
        });
        
        return {
          success: true,
          notificationsSent: enabledDevices.length,
        };
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          url: z.string().optional(),
          title: z.string().optional(),
          favicon: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateSite(id, data);
        return { success: true };
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteSite(input.id);
        return { success: true };
      }),
  }),

  version: router({
    current: publicProcedure.query(async () => {
      return await getCurrentVersion();
    }),

    list: publicProcedure.query(async () => {
      return await getAllVersions();
    }),

    update: publicProcedure
      .input(
        z.object({
          version: z.string(),
          releaseNotes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await insertVersion(input);
        
        // Send update notification to all devices
        const devices = await getAllDevices();
        const enabledDevices = devices.filter((d) => d.notificationEnabled === 1);
        
        await insertNotification({
          title: "Yeni Versiyon Mevcut!",
          body: `CostaBrowser ${input.version} sürümüne güncellendi. Yeni özellikler için sayfayı yenileyin.`,
          deliveredCount: enabledDevices.length,
        });
        
        return {
          success: true,
          notificationsSent: enabledDevices.length,
        };
      }),
  }),

  icon: router({
    get: publicProcedure.query(async () => {
      // Return default icon URL
      return { iconUrl: "/icon-192.png" };
    }),

    update: publicProcedure
      .input(z.object({ iconUrl: z.string() }))
      .mutation(async ({ input }) => {
        // For now, just return success
        // In production, you would store this in database or update manifest
        return { success: true, iconUrl: input.iconUrl };
      }),
  }),
});

export type AppRouter = typeof appRouter;
