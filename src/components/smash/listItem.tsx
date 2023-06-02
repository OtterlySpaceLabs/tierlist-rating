import Image from "next/image"
import { useCallback, useState } from "react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import ImagePreviewDialog from "../list/imagePreviewDialog"
import { type SmashWithSubmissionAndAuthor } from "../../server/api/routers/smash/smash.interface"
import { SmashType, SmashVote } from "@prisma/client"

interface ListItemProps {
	smash: SmashWithSubmissionAndAuthor
}

export default function ListSmashItem({ smash }: ListItemProps) {
	const [openPreview, setOpenPreview] = useState(false)

	const smashTypeToString = useCallback((smashType: SmashType) => {
		switch (smashType) {
			case SmashType.TOP:
				return "Top"
			case SmashType.VERSE:
				return "Versatile"
			case SmashType.BOTTOM:
				return "Bottom"
		}
	}, [])

	const smashVoteToString = useCallback((smashVote: SmashVote) => {
		switch (smashVote) {
			case SmashVote.SMASH:
				return "Smash"
			case SmashVote.PASS:
				return "Pass"
		}
	}, [])

	return (
		<div className="flex flex-col justify-center sm:flex-row sm:justify-normal">
			<ImagePreviewDialog
				submission={smash.submission}
				open={openPreview}
				onClose={() => setOpenPreview(false)}
			/>
			<div className="relative mx-auto mb-4 flex h-52 w-52 justify-center align-middle sm:mx-0 sm:mb-0">
				<Image
					unoptimized
					src={smash.submission.image}
					alt={smash.submission.name}
					fill
					className="cursor-pointer rounded-sm bg-sky-100/10 object-cover shadow"
					onClick={() => setOpenPreview(true)}
				/>
			</div>

			<div className="flex flex-col justify-center sm:px-8">
				<span className="text-lg">
					<span className="font-semibold">{smash.submission.name}</span> from{" "}
					<span className="font-semibold italic">{smash.submission.game}</span>
				</span>

				<span>
					<span>Submitted by</span>
					<span className="ml-1 italic text-orange-400">{smash.submission.author.name}</span>
				</span>

				<div className="flex flex-col pt-4">
					<span>
						You voted <span className="font-bold text-orange-400">{smashVoteToString(smash.vote)}</span>
					</span>
					{smash.type ? (
						<span>
							You think they are{" "}
							<span className="font-bold text-orange-400">{smashTypeToString(smash.type)}</span>
						</span>
					) : (
						<span>You haven&apos;t voted on their type yet</span>
					)}
				</div>
			</div>

			{/* // TODO - Make the edit page */}
			{/* <div className="flex flex-col items-end justify-center sm:ml-auto sm:px-8">
				<div className="mt-2 flex gap-2">
					<Link
						href={`/streamer/smash/edit/${smash.id}`}
						className="inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
					>
						<PencilSquareIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
						Edit vote
					</Link>
				</div>
			</div> */}
		</div>
	)
}
