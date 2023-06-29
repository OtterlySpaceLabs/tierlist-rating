import { SmashType, SmashVote } from "@prisma/client"
import { z } from "zod"

export const smashVoteCreationSchema = z
	.object({
		submissionId: z.string(),
		vote: z.nativeEnum(SmashVote),
		type: z.nativeEnum(SmashType).optional()
	})
	.refine(
		(data) => {
			if (data.vote === SmashVote.SMASH) {
				return data.type !== undefined
			}
			return true
		},
		{
			message: "Type is required for Smash votes",
			path: ["type"]
		}
	)

export const smashVoteEditionSchema = z
	.object({
		smashId: z.string(),
		vote: z.nativeEnum(SmashVote),
		type: z.nativeEnum(SmashType).optional()
	})
	.refine(
		(data) => {
			if (data.vote === SmashVote.SMASH) {
				return data.type !== undefined
			}
			return true
		},
		{
			message: "Type is required for Smash votes",
			path: ["type"]
		}
	)
