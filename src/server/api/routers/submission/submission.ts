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
	})
})
