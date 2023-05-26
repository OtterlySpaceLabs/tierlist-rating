import { z } from "zod"

export const submissionCreationSchema = z.object({
	name: z.string().min(1, "Name is required").max(69, "Too long"),
	game: z.string().min(1, "Game name is required").max(120, "Too long"),
	image: z.string().url("Image must be a valid URL")
})
