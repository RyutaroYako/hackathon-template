import { router, protectedProcedure } from "../lib/trpc";
import { z } from "zod";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

const updateUserNameSchema = z.object({
  name: z.string().min(1).max(100),
});

export const userRouter = router({
  updateName: protectedProcedure
    .input(updateUserNameSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedUser = await db
        .update(user)
        .set({ name: input.name })
        .where(eq(user.id, ctx.session.user.id))
        .returning();

      return updatedUser[0];
    }),

  getCurrentUser: protectedProcedure
    .query(async ({ ctx }) => {
      const currentUser = await db
        .select()
        .from(user)
        .where(eq(user.id, ctx.session.user.id))
        .limit(1);

      return currentUser[0];
    }),
});