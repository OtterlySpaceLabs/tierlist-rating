import { createTRPCRouter } from "~/server/api/trpc"
import { igdbRouter } from "./routers/igdb"
import { submissionRouter } from "./routers/submission/submission"
import { smashRouter } from "./routers/smash/smash"
import { rankRouter } from "./routers/rank/rank"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	igdb: igdbRouter,
	submission: submissionRouter,
	smash: smashRouter,
	rank: rankRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
