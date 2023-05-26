import { UploadButton } from "@uploadthing/react"
import "@uploadthing/react/styles.css"
import type { OurFileRouter } from "~/server/uploadthing"

export default function UploadImage() {
	return (
		<UploadButton<OurFileRouter>
			endpoint="imageUploader"
			onClientUploadComplete={(res) => {
				// Do something with the response
				console.log("Files: ", res)
				alert("Upload Completed")
			}}
			onUploadError={(error: Error) => {
				// Do something with the error.
				alert(`ERROR! ${error.message}`)
			}}
		/>
	)
}
