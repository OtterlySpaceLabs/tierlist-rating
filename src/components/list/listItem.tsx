import { type User, type Submission } from "@prisma/client"
import Image from "next/image"
import { useMemo } from "react"
import { cn } from "../../lib/utils"
import { CheckCircleIcon, PencilSquareIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline"
import { api } from "../../utils/api"
import Link from "next/link"

interface ListItemProps {
	submission: Submission
	moderationMode?: false
	onStatusChange?: () => void
	showDeleteDialog: (submission: Submission) => void
}

interface ListItemModerationProps {
	submission: Submission & { author: User }
	moderationMode: true
	onStatusChange?: () => void
	showDeleteDialog: (submission: Submission) => void
}

type ListItemCombinedProps = ListItemProps | ListItemModerationProps

export default function ListItem({ submission, moderationMode, showDeleteDialog, ...props }: ListItemCombinedProps) {
	const statusBadgeStyle = useMemo(() => {
		switch (submission.status) {
			case "PENDING":
				return "bg-yellow-200 text-yellow-800"
			case "APPROVED":
				return "bg-green-200 text-green-800"
			case "REJECTED":
				return "bg-red-200 text-red-800"
		}
	}, [submission])

	const setStatusMutation = api.submission.setStatus.useMutation()

	const setStatus = async (status: "APPROVED" | "REJECTED") => {
		if (!moderationMode) {
			return
		}
		await setStatusMutation.mutateAsync({
			id: submission.id,
			status
		})
		props.onStatusChange?.()
	}

	return (
		<div className="flex flex-col justify-center sm:flex-row sm:justify-normal">
			<div className="relative mx-auto mb-4 flex h-52 w-52 justify-center align-middle sm:mx-0 sm:mb-0">
				<Image
					unoptimized
					src={submission.image}
					alt={submission.name}
					fill
					className="rounded-sm bg-sky-100/10 object-cover shadow"
				/>
			</div>

			<div className="flex flex-col justify-center sm:px-8">
				<span className="text-lg font-semibold">{submission.name}</span>
				<span className="italic">{submission.game}</span>
				{moderationMode && (
					<span className="pt-2">
						<span className="font-semibold">By:</span>
						<span className="ml-1">{submission.author.name}</span>
					</span>
				)}
				<span className="pt-2">
					<span className="font-semibold">Status:</span>
					<span
						className={cn("ml-2 rounded-full px-2 py-1 text-sm font-semibold capitalize", statusBadgeStyle)}
					>
						{submission.status.toLowerCase()}
					</span>
				</span>
			</div>

			<div className="flex flex-col items-end justify-center sm:ml-auto sm:px-8">
				<div className="mt-2 flex gap-2">
					<Link
						href={`/submit/edit/${submission.id}`}
						className="inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
					>
						<PencilSquareIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
						Edit
					</Link>
					<button
						type="button"
						className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
						onClick={() => void showDeleteDialog(submission)}
					>
						<TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
						Delete
					</button>
				</div>

				{moderationMode && (
					<div className="mt-2 flex gap-2">
						<button
							type="button"
							className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
							onClick={() => void setStatus("APPROVED")}
						>
							<CheckCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
							Approve
						</button>
						<button
							type="button"
							className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
							onClick={() => void setStatus("REJECTED")}
						>
							<XCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
							Reject
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
