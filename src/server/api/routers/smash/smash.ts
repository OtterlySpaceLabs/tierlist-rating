import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { smashVoteCreationSchema, smashVoteEditionSchema } from "./smash.dto"

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
	editVote: protectedProcedure.input(smashVoteEditionSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to vote.")
		}

		const vote = await ctx.prisma.smashEntry.findUnique({
			where: {
				id: input.smashId
			}
		})

		if (!vote) {
			throw new Error("Vote not found.")
		}

		if (vote.authorId !== ctx.session.user.id) {
			throw new Error("You are not authorized to edit this vote.")
		}

		const updatedVote = await ctx.prisma.smashEntry.update({
			where: {
				id: input.smashId
			},

			data: {
				vote: input.vote,
				type: input.type
			}
		})

		return updatedVote
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
