import { getServerSession } from "next-auth"
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy"
import { authOptions } from "./auth"
const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f
		// Set permissions and file types for this FileRoute
		// FIXME: restrict to jpg/png
		.fileTypes(["image"])
		.maxSize("1MB")
		.middleware(async (req, res) => {
			// This code runs on your server before upload
			const session = await getServerSession(req, res, authOptions)

			// If you throw, the user will not be able to upload
			if (!session) throw new Error("Unauthorized")

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: session.user.id }
		})
		.onUploadComplete(() => {
			// This code RUNS ON YOUR SERVER after upload
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
