import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { upsertDevice, getDeviceStats, insertNotification, getAllDevices } from "./deviceDb";

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
});

export type AppRouter = typeof appRouter;
