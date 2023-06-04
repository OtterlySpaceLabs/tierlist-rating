import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../../trpc"
import { rankCreationSchema, rankEntryCreationSchema, rankEntryUpdateSchema, rankUpdateSchema } from "./rank.dto"

export const rankRouter = createTRPCRouter({
	getTierlist: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to view tierlists.")
		}

		let tierlist = await ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: {
					orderBy: {
						order: "asc"
					}
				}
			}
		})

		if (!tierlist) {
			tierlist = await ctx.prisma.tierlist.create({
				data: {
					authorId: ctx.session.user.id,
					ranks: {
						create: [
							{
								name: "S",
								order: 0
							},
							{
								name: "A",
								order: 1
							},
							{
								name: "B",
								order: 2
							},
							{
								name: "C",
								order: 3
							},
							{
								name: "D",
								order: 4
							},
							{
								name: "E",
								order: 5
							},
							{
								name: "F",
								order: 6
							}
						]
					}
				},
				include: {
					ranks: {
						orderBy: {
							order: "asc"
						}
					}
				}
			})
		}

		return tierlist
	}),
	getEntriesToRank: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to vote.")
		}

		const smashEntries = await ctx.prisma.smashEntry.findMany({
			where: {
				authorId: ctx.session.user.id,
				submission: {
					status: "APPROVED"
				},
				vote: "SMASH"
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
	}),
	getRankEntries: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to view tierlists.")
		}

		const rankEntries = await ctx.prisma.rankEntry.findMany({
			where: {
				rank: {
					tierlist: {
						authorId: ctx.session.user.id
					}
				},
				submission: {
					status: "APPROVED"
				}
			},
			include: {
				rank: true
			}
		})

		return rankEntries
	}),
	createRank: protectedProcedure.input(rankCreationSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to create tierlists.")
		}

		const tierlistRanks = await ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: true
			}
		})

		if (!tierlistRanks) {
			throw new Error("You do not have a tierlist to update.")
		}

		const rank = await ctx.prisma.tierlistRank.create({
			data: {
				...input,
				tierlistId: tierlistRanks.id,
				order: input.order ?? tierlistRanks.ranks.length
			}
		})

		// If the rank was inserted in the middle of the list, we need to update the order of the ranks that come after it
		if (rank.order < tierlistRanks.ranks.length - 1) {
			await ctx.prisma.tierlistRank.updateMany({
				where: {
					tierlistId: tierlistRanks.id,
					order: {
						gt: rank.order
					}
				},
				data: {
					order: {
						increment: 1
					}
				}
			})
		}

		return rank
	}),
	updateRank: protectedProcedure.input(rankUpdateSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to update tierlists.")
		}

		const tierlistRanks = await ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: true
			}
		})

		if (!tierlistRanks) {
			throw new Error("You do not have a tierlist to update.")
		}

		const rank = tierlistRanks.ranks.find((r) => r.id === input.id)

		if (!rank) {
			throw new Error("You do not have a tierlist to update.")
		}

		await ctx.prisma.tierlistRank.update({
			where: {
				id: input.id
			},
			data: {
				name: input.name,
				order: input.order
			}
		})

		// If the order changed, we need to update the other ranks to the right order
		if (rank.order !== input.order) {
			// Get the ranks that are between the old and new order
			const ranksToUpdate = tierlistRanks.ranks.filter((r) => {
				if (rank.order < input.order) {
					return r.order > rank.order && r.order <= input.order
				} else {
					return r.order >= input.order && r.order < rank.order
				}
			})

			// Update the order of the ranks in a single transaction
			await ctx.prisma.$transaction(
				ranksToUpdate.map((r) =>
					ctx.prisma.tierlistRank.update({
						where: {
							id: r.id
						},
						data: {
							order: r.order + (rank.order < input.order ? -1 : 1)
						}
					})
				)
			)
		}

		return ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: {
					orderBy: {
						order: "asc"
					}
				}
			}
		})
	}),
	deleteRank: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to update tierlists.")
		}

		const tierlistRanks = await ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: true
			}
		})

		if (!tierlistRanks) {
			throw new Error("You do not have a tierlist to update.")
		}

		const rank = tierlistRanks.ranks.find((r) => r.id === input.id)

		if (!rank) {
			throw new Error("You do not have a tierlist to update.")
		}

		await ctx.prisma.tierlistRank.delete({
			where: {
				id: input.id
			}
		})

		// If the rank was deleted in the middle of the list, we need to update the order of the ranks that come after it
		if (rank.order < tierlistRanks.ranks.length - 1) {
			await ctx.prisma.tierlistRank.updateMany({
				where: {
					tierlistId: tierlistRanks.id,
					order: {
						gt: rank.order
					}
				},
				data: {
					order: {
						increment: -1
					}
				}
			})
		}

		return ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: {
					orderBy: {
						order: "asc"
					}
				}
			}
		})
	}),
	addRankEntry: protectedProcedure.input(rankEntryCreationSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to update tierlists.")
		}

		const tierlistRanks = await ctx.prisma.tierlist.findFirst({
			where: {
				authorId: ctx.session.user.id
			},
			include: {
				ranks: {
					orderBy: {
						order: "asc"
					}
				}
			}
		})

		if (!tierlistRanks) {
			throw new Error("You do not have a tierlist to update.")
		}

		const rank = tierlistRanks.ranks.find((r) => r.id === input.rankId)

		if (!rank) {
			throw new Error("You do not have a tierlist to update.")
		}

		const rankEntries = await ctx.prisma.rankEntry.findMany({
			where: {
				rankId: input.rankId
			},
			orderBy: {
				index: "asc"
			}
		})

		const smashEntry = await ctx.prisma.smashEntry.findFirst({
			where: {
				id: input.smashId
			}
		})

		if (!smashEntry) {
			throw new Error("The smash entry does not exist.")
		}

		const newRankEntry = await ctx.prisma.rankEntry.create({
			data: {
				rank: {
					connect: {
						id: input.rankId
					}
				},
				submission: {
					connect: {
						id: smashEntry.submissionId
					}
				},
				smashEntry: {
					connect: {
						id: input.smashId
					}
				},
				index: input.index ?? rankEntries.length,
				author: {
					connect: {
						id: ctx.session.user.id
					}
				}
			}
		})

		// If the index changed, we need to update the other entries to the right index
		if (newRankEntry.index !== input.index) {
			// Get the entries that are between the old and new index
			const entriesToUpdate = rankEntries.filter((r) => {
				if (newRankEntry.index < input.index) {
					return r.index > newRankEntry.index && r.index <= input.index
				} else {
					return r.index >= input.index && r.index < newRankEntry.index
				}
			})

			// Update the index of the entries in a single transaction
			await ctx.prisma.$transaction(
				entriesToUpdate.map((r) =>
					ctx.prisma.rankEntry.update({
						where: {
							id: r.id
						},
						data: {
							index: r.index + (newRankEntry.index < input.index ? -1 : 1)
						}
					})
				)
			)
		}

		return newRankEntry
	}),
	updateRankEntry: protectedProcedure.input(rankEntryUpdateSchema).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to update tierlists.")
		}

		const rankEntry = await ctx.prisma.rankEntry.findFirst({
			where: {
				id: input.id
			}
		})

		const newRank = await ctx.prisma.tierlistRank.findFirst({
			where: {
				id: input.rankId
			},
			include: {
				entries: {
					orderBy: {
						index: "asc"
					}
				}
			}
		})

		console.log(input, rankEntry, newRank)

		if (!rankEntry || !newRank) {
			throw new Error("You do not have a tierlist to update.")
		}

		const updatedRank = await ctx.prisma.rankEntry.update({
			where: {
				id: input.id
			},
			data: {
				index: input.index ?? newRank?.entries.length,
				rankId: input.rankId
			}
		})

		// If rankId changed, we need to update the other entries to the right index
		if (rankEntry.rankId !== input.rankId) {
			// Update all the entries that were after the old index
			const entriesToUpdate = await ctx.prisma.rankEntry.findMany({
				where: {
					rankId: rankEntry.rankId,
					index: {
						gt: rankEntry.index
					}
				}
			})

			// Update the index of the entries in a single transaction
			await ctx.prisma.$transaction(
				entriesToUpdate.map((r) =>
					ctx.prisma.rankEntry.update({
						where: {
							id: r.id
						},
						data: {
							index: r.index - 1
						}
					})
				)
			)
		}

		// If there is elements at the new index, we need to update the other entries to the right index
		const entriesToUpdate = newRank.entries.filter((r) => r.index >= updatedRank.index)

		if (entriesToUpdate.length > 1) {
			// Update the index of the entries in a single transaction
			await ctx.prisma.$transaction(
				entriesToUpdate.map((r) =>
					ctx.prisma.rankEntry.update({
						where: {
							id: r.id
						},
						data: {
							index: r.index + 1
						}
					})
				)
			)
		}

		return updatedRank
	}),
	deleteRankEntry: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		if (!ctx.session.user.isStreamer) {
			throw new Error("You are not authorized to update tierlists.")
		}

		const rankEntry = await ctx.prisma.rankEntry.findFirst({
			where: {
				id: input.id
			}
		})

		if (!rankEntry) {
			throw new Error("You do not have a tierlist to update.")
		}

		// Update all the entries that were after the old index
		const entriesToUpdate = await ctx.prisma.rankEntry.findMany({
			where: {
				rankId: rankEntry.rankId,
				index: {
					gt: rankEntry.index
				}
			}
		})

		// Update the index of the entries in a single transaction
		await ctx.prisma.$transaction(
			entriesToUpdate.map((r) =>
				ctx.prisma.rankEntry.update({
					where: {
						id: r.id
					},
					data: {
						index: r.index - 1
					}
				})
			)
		)

		return ctx.prisma.rankEntry.delete({
			where: {
				id: input.id
			}
		})
	})
})
