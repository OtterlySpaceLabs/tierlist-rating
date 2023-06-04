import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { smashVoteCreationSchema } from "./smash.dto"

export const smashRouter = createTRPCRouter({
	vote: protectedProcedure.input(smashVoteCreationSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to vote.")
		}

		const vote = await ctx.prisma.smashEntry.create({
			data: {
				...input,
				authorId: ctx.session.user.id
			}
		})
		return vote
	}),
	getSubmissionsToVote: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to vote.")
		}

		const submissions = await ctx.prisma.submission.findMany({
			where: {
				status: "APPROVED",
				SmashEntries: {
					none: {
						authorId: ctx.session.user.id
					}
				}
			},
			include: {
				author: {
					select: {
						id: true,
						name: true,
						image: true
					}
				}
			}
		})
		return submissions
	}),
	getSubmissionsVoted: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to vote.")
		}

		const smashEntries = await ctx.prisma.smashEntry.findMany({
			where: {
				authorId: ctx.session.user.id,
				submission: {
					status: "APPROVED"
				}
			},
			include: {
				submission: {
					include: {
						author: {
							select: {
								id: true,
								name: true,
								image: true
							}
						}
					}
				}
			}
		})
		return smashEntries
	})
})
