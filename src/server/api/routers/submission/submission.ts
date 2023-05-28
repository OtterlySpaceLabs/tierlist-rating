import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { submissionCreationSchema, submissionUpdateSchema } from "./submission.dto"
import { SubmissionStatus } from "@prisma/client"
import { z } from "zod"

export const submissionRouter = createTRPCRouter({
	create: protectedProcedure.input(submissionCreationSchema).mutation(({ input, ctx }) => {
		const submission = ctx.prisma.submission.create({
			data: {
				...input,
				authorId: ctx.session.user.id
			}
		})
		return submission
	}),
	update: protectedProcedure.input(submissionUpdateSchema).mutation(async ({ input, ctx }) => {
		const currSubmission = await ctx.prisma.submission.findUnique({
			where: {
				id: input.id
			}
		})

		if (!currSubmission) {
			throw new Error("Submission not found.")
		}

		if (currSubmission.authorId !== ctx.session.user.id && !ctx.session.user.isModerator) {
			throw new Error("You are not authorized to update this submission.")
		}

		return ctx.prisma.submission.update({
			where: {
				id: input.id
			},
			data: {
				...input,
				...(!ctx.session.user.isModerator && { status: SubmissionStatus.PENDING })
			}
		})
	}),
	delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		const currSubmission = await ctx.prisma.submission.findUnique({
			where: {
				id: input.id
			}
		})

		if (!currSubmission) {
			throw new Error("Submission not found.")
		}

		if (currSubmission.authorId !== ctx.session.user.id && !ctx.session.user.isModerator) {
			throw new Error("You are not authorized to delete this submission.")
		}

		return ctx.prisma.submission.delete({
			where: {
				id: input.id
			}
		})
	}),
	listAll: protectedProcedure.query(({ ctx }) => {
		if (!ctx.session.user.isModerator) {
			throw new Error("You are not authorized to view all submissions.")
		}
		return ctx.prisma.submission.findMany({
			include: {
				author: true
			}
		})
	}),
	setStatus: protectedProcedure
		.input(z.object({ id: z.string(), status: z.nativeEnum(SubmissionStatus) }))
		.mutation(({ input, ctx }) => {
			if (!ctx.session.user.isModerator) {
				throw new Error("You are not authorized to set submission status.")
			}
			return ctx.prisma.submission.update({
				where: {
					id: input.id
				},
				data: {
					status: input.status
				}
			})
		})
})
