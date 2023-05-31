import { z } from "zod"

export const rankEntryCreationSchema = z.object({
	smashId: z.string(),
	rankId: z.string(),
	index: z.number().min(0, "Order must be positive").max(100, "Order must be less than 100")
})

export const rankEntryUpdateSchema = z.object({
	id: z.string(),
	rankId: z.string(),
	index: z.number().min(0, "Order must be positive").max(100, "Order must be less than 100").optional()
})

export const rankCreationSchema = z.object({
	name: z.string().min(1, "Name is required").max(69, "Too long"),
	order: z.number().min(0, "Order must be positive").max(100, "Order must be less than 100").optional()
})

export const rankUpdateSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "Name is required").max(69, "Too long"),
	order: z.number().min(0, "Order must be positive").max(100, "Order must be less than 100")
})
