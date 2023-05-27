import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { submissionCreationSchema } from "./submission.dto"

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
	listAll: protectedProcedure.query(({ ctx }) => {
		if (!ctx.session.user.isModerator) {
			throw new Error("You are not authorized to view all submissions.")
		}
		return ctx.prisma.submission.findMany({
			include: {
				author: true
			}
		})
	})
})
