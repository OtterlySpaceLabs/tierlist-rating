import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Button } from "../ui/button"
import ButtonRadio from "./buttonRadio"
import { api } from "../../utils/api"
import { smashVoteCreationSchema } from "../../server/api/routers/smash/smash.dto"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormMessage } from "../ui/form"
import ImagePreviewDialog from "../list/imagePreviewDialog"
import { type SubmissionWithAuthor } from "../../server/api/routers/submission/submission.interface"

interface SmashHandlerProps {
	submissions: SubmissionWithAuthor[]
	refetch: () => void
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

export default function SmashHandler({ submissions, refetch }: SmashHandlerProps) {
	const randSubmissions = useMemo(() => submissions.sort(() => Math.random() - 0.5), [submissions])
	const [votedSubmissions, setVotedSubmissions] = useState<SubmissionWithAuthor[]>([])
	const [currentSubmission, setCurrentSubmission] = useState<SubmissionWithAuthor | null>(null)
	const getNextSubmission = useMemo(() => {
		if (currentSubmission) {
			return currentSubmission
		}
		return randSubmissions.filter((submission) => !votedSubmissions.includes(submission))[0] ?? null
	}, [currentSubmission, randSubmissions, votedSubmissions])
	useEffect(() => {
		if (getNextSubmission) {
			setCurrentSubmission(getNextSubmission)
		}
	}, [getNextSubmission])

	const form = useForm<z.infer<typeof smashVoteCreationSchema>>({
		resolver: zodResolver(smashVoteCreationSchema),
		defaultValues: {
			submissionId: undefined,
			vote: undefined,
			type: undefined
		}
	})

	const sendVoteMutation = api.smash.vote.useMutation()
	const handleSubmission = async (submission: z.infer<typeof smashVoteCreationSchema>) => {
		try {
			await sendVoteMutation.mutateAsync(submission)
			if (currentSubmission) {
				setVotedSubmissions([...votedSubmissions, currentSubmission])
			}
			form.resetField("submissionId")
			form.resetField("vote")
			form.resetField("type")
			setCurrentSubmission(null)
		} catch (error) {
			console.error(error)
		}
	}

	const [openPreview, setOpenPreview] = useState(false)

	return (
		<>
			{currentSubmission && (
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
									{...form.register("submissionId")}
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
									Send my vote
								</Button>
							</div>
						</form>
					</Form>
				</div>
			)}
			{!currentSubmission && !getNextSubmission && (
				<div className="flex h-full flex-col items-center">
					<span className="mb-8 text-xl">No more submissions to vote on!</span>
					<Button onClick={() => refetch()}>Refresh</Button>
				</div>
			)}
		</>
	)
}
