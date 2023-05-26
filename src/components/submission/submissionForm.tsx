import { type z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { UploadButton } from "@uploadthing/react"
import { type OurFileRouter } from "../../server/uploadthing"
import Image from "next/image"
import { submissionCreationSchema } from "../../server/api/routers/submission/submission.dto"
import { api } from "../../utils/api"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { CheckCheckIcon } from "lucide-react"

export default function SubmissionForm() {
	const [submissionComplete, setSubmissionComplete] = useState(false)
	// 1. Define your form.
	const form = useForm<z.infer<typeof submissionCreationSchema>>({
		resolver: zodResolver(submissionCreationSchema),
		defaultValues: {
			name: "",
			game: "",
			image: ""
		}
	})

	const submissionCreationMutate = api.submission.create.useMutation()

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof submissionCreationSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		void submissionCreationMutate
			.mutateAsync(values)
			.then((res) => {
				console.log(res)
				form.reset()
				setSubmissionComplete(true)
			})
			.catch((err) => {
				console.log(err)
			})
	}
	return (
		<>
			{submissionComplete && (
				<Alert className="mb-8">
					<CheckCheckIcon className="h-4 w-4" />
					<AlertTitle>Submission completed!</AlertTitle>
					<AlertDescription>
						Your submission has been received and will be reviewed by our team.
					</AlertDescription>
				</Alert>
			)}
			<Form {...form}>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						void form.handleSubmit(onSubmit)()
					}}
					className="space-y-8"
				>
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<div className="grid grid-cols-1 gap-4 space-y-2 sm:grid-cols-3">
								<FormLabel className="sm:col-span-3">Character picture</FormLabel>
								<div className="flex items-center justify-center">
									<UploadButton<OurFileRouter>
										endpoint="imageUploader"
										onClientUploadComplete={(res) => {
											// Do something with the response
											console.log("Files: ", res)
											if (res && res[0]) {
												field.onChange(res[0].fileUrl)
											}
										}}
										onUploadError={(error: Error) => {
											// Do something with the error.
											form.setError("image", {
												type: "manual",
												message: error.message
											})
										}}
									/>
								</div>
								<div className="flex items-center justify-center sm:col-span-2">
									{field.value ? (
										<div className="relative h-64 w-64 sm:h-80 sm:w-80">
											<Image
												unoptimized
												src={field.value}
												// width={200}
												// height={200}
												fill
												className="rounded-sm object-cover"
												alt="Preview of the image"
											/>
										</div>
									) : (
										<div className="relative h-64 w-64 rounded-sm border-4 border-dashed border-gray-300 dark:border-gray-600 sm:h-80 sm:w-80"></div>
									)}
								</div>
								<div className="col-span-3">
									<FormMessage />
								</div>
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Character name</FormLabel>
								<FormControl>
									<Input placeholder="Sidon" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="game"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Game name</FormLabel>
								<FormControl>
									<Input placeholder="The Legend of Zelda: Tears of the Kingdom" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
		</>
	)
}
