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
import Link from "next/link"
import useNameSearch from "./useNameSearch"

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

	const { searchResults, setSearchInput } = useNameSearch()

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof submissionCreationSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		void submissionCreationMutate
			.mutateAsync(values)
			.then(() => {
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
					<div className="pb-8">
						<h2 className="pb-4 text-2xl font-bold">Rules to submit a character</h2>
						<ul className="list-inside list-disc pb-4">
							<li>
								Character must be fictional and appear in a video game (anime characters are tolerated)
							</li>
							<li>They need to be 18+</li>
							<li>Try to use official artwork or in-game captures</li>
							<li>
								Avoid fanarts, especially if its artist is unknown or if they don&apos;t allow repost
							</li>
							<li>
								Images needs to follow Twitch{" "}
								<Link
									href="https://www.twitch.tv/p/en/legal/terms-of-service/"
									className="text-orange-400 underline"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									href="https://safety.twitch.tv/s/article/Community-Guidelines"
									className="text-orange-400 underline"
								>
									Community Guidelines
								</Link>
							</li>
						</ul>
						<p>
							Moderators can reject your submission based on their judgment following these rules and will
							use principle of caution in case of doubt.
						</p>
					</div>

					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<div className="grid grid-cols-1 gap-4 space-y-2 sm:grid-cols-3">
								<FormLabel className="col-span-1 sm:col-span-3">Character picture</FormLabel>
								<div className="col-span-1 flex items-center justify-center">
									<UploadButton<OurFileRouter>
										endpoint="imageUploader"
										onClientUploadComplete={(res) => {
											// Do something with the response
											if (res && res[0]) {
												field.onChange(res[0].fileUrl)
												form.clearErrors("image")
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
										<div className="relative h-64 w-64 rounded-lg border-4 border-dashed border-gray-300 dark:border-gray-600 sm:h-80 sm:w-80"></div>
									)}
								</div>
								<div className="sm:col-span-3">
									<FormMessage />
								</div>
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<FormLabel>Character name</FormLabel>
								<FormControl>
									<Input
										placeholder="Sidon"
										{...field}
										onChange={(event) => {
											onChange(event)
											setSearchInput(event.target.value)
										}}
									/>
								</FormControl>
								<FormMessage />
								{searchResults && searchResults.length > 0 && (
									<div className="mt-4">
										<h3 className="text-lg font-semibold">
											Characters with similar names are already submitted:
										</h3>
										<ul className="list-inside">
											{searchResults.map(({ item: result }) => (
												<li key={result.id} className="ml-4">
													<span>{result.name}</span> -
													<span className="ml-1">{result.game}</span>
												</li>
											))}
										</ul>
									</div>
								)}
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
