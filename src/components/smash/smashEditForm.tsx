import { useForm } from "react-hook-form"
import { type SmashWithSubmissionAndAuthor } from "../../server/api/routers/smash/smash.interface"
import { zodResolver } from "@hookform/resolvers/zod"
import { smashVoteEditionSchema } from "../../server/api/routers/smash/smash.dto"
import { type z } from "zod"
import { api } from "../../utils/api"
import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { CheckCheckIcon } from "lucide-react"
import ImagePreviewDialog from "../list/imagePreviewDialog"
import Image from "next/image"
import { Form, FormField, FormMessage } from "../ui/form"
import ButtonRadio from "./buttonRadio"
import { Button } from "../ui/button"

interface SmashEditFormProps {
	smash: SmashWithSubmissionAndAuthor
}

const smashVoteOptions = [
	{
		label: "Smash",
		value: "SMASH"
	},
	{
		label: "Pass",
		value: "PASS"
	}
]

const smashTypeOptions = [
	{
		label: "Top",
		value: "TOP"
	},
	{
		label: "Versatile",
		value: "VERSE"
	},
	{
		label: "Bottom",
		value: "BOTTOM"
	}
]

export default function SmashEditForm({ smash }: SmashEditFormProps) {
	const router = useRouter()
	const submissionComplete = useMemo(() => router.query.success === "true", [router.query])

	console.log(smash)

	const currentSubmission = useMemo(() => smash.submission, [smash.submission])

	const form = useForm<z.infer<typeof smashVoteEditionSchema>>({
		resolver: zodResolver(smashVoteEditionSchema),
		defaultValues: {
			smashId: smash.id,
			vote: smash.vote,
			type: smash.type ?? undefined
		}
	})

	const sendVoteMutation = api.smash.editVote.useMutation()
	const handleSubmission = async (payload: z.infer<typeof smashVoteEditionSchema>) => {
		try {
			await sendVoteMutation.mutateAsync(payload)
			void router.push(`/streamer/smash/edit/${smash.id}?success=true`)
		} catch (error) {
			console.error(error)
		}
	}

	const [openPreview, setOpenPreview] = useState(false)

	return (
		<>
			{submissionComplete && (
				<Alert className="mb-8">
					<CheckCheckIcon className="h-4 w-4" />
					<AlertTitle>Edition completed!</AlertTitle>
					<AlertDescription>Your vote has been successfully updated.</AlertDescription>
				</Alert>
			)}
			<div className="flex w-full columns-2 items-center">
				<div className="flex grow flex-col items-center">
					<span className="mb-4 text-xl">
						<span className="font-bold capitalize">{currentSubmission.name}</span> from{" "}
						<span className="font-bold capitalize">{currentSubmission.game}</span>
					</span>
					<div className="relative mb-4 h-96 w-96">
						<ImagePreviewDialog
							submission={currentSubmission}
							open={openPreview}
							onClose={() => setOpenPreview(false)}
						/>
						<Image
							unoptimized
							src={currentSubmission.image}
							alt={currentSubmission.name}
							fill
							className="cursor-pointer rounded-sm bg-sky-100/10 object-cover shadow"
							onClick={() => setOpenPreview(true)}
						/>
					</div>
					<span>
						Submitted by <span className="italic text-orange-400">{currentSubmission.author.name}</span>
					</span>
				</div>
				<Form {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault()
							void form.handleSubmit(handleSubmission)()
						}}
					>
						<div className="flex grow flex-col items-center">
							<input
								type="hidden"
								className="hidden"
								{...form.register("smashId")}
								value={currentSubmission.id}
							/>
							<FormField
								control={form.control}
								name="vote"
								render={({ field }) => (
									<>
										<ButtonRadio
											title="Smash or Pass?"
											options={smashVoteOptions}
											onChange={({ value }) => field.onChange(value)}
											value={field.value}
										/>
										{form.formState.errors.vote && (
											<div className="mb-2">
												<FormMessage />
											</div>
										)}
									</>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<>
										<ButtonRadio
											title="Top, Versatile, or Bottom?"
											options={smashTypeOptions}
											onChange={({ value }) => field.onChange(value)}
											value={field.value}
										/>
										{form.formState.errors.type && (
											<div className="mb-2">
												<FormMessage />
											</div>
										)}
									</>
								)}
							/>
							<Button className="mt-4 max-w-[8rem]" type="submit">
								Update my vote
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	)
}
