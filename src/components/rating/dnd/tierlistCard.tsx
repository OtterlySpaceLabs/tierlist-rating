import { useDrag } from "react-dnd"
import { type SmashWithSubmissionAndAuthor } from "../../../server/api/routers/smash/smash.interface"
import Image from "next/image"
import { cn } from "../../../lib/utils"
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import ImagePreviewDialog from "../../list/imagePreviewDialog"
import { useState } from "react"

interface TierlistCardDndProps {
	smash: SmashWithSubmissionAndAuthor
	isDragging?: boolean
}

export default function TierlistCardDnd({ smash }: TierlistCardDndProps) {
	const [{ opacity }, dragRef] = useDrag(() => ({
		type: "SMASH",
		item: smash,
		collect: (monitor) => ({
			opacity: monitor.isDragging() ? 0.5 : 1
		})
	}))

	const [openPreview, setOpenPreview] = useState(false)

	return (
		<div
			ref={dragRef}
			className={cn("group flex cursor-pointer flex-col items-center justify-center", {
				"opacity-50": opacity < 1
			})}
		>
			<ImagePreviewDialog
				submission={smash.submission}
				smash={smash}
				open={openPreview}
				onClose={() => setOpenPreview(false)}
			/>
			<div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-gray-700">
				<div className="absolute right-0 top-0 z-20 p-1" onClick={() => setOpenPreview(true)}>
					<ArrowsPointingOutIcon className="h-5 w-5 rounded bg-slate-500/50 text-white opacity-0 transition-opacity group-hover:opacity-100" />
				</div>
				<Image
					unoptimized
					src={smash.submission.image}
					alt={smash.submission.name}
					className="h-20 w-20 rounded-lg object-cover"
					fill
				/>
				<span className="z-10 mb-1 mt-auto rounded-sm bg-slate-500/50 p-1 text-xs font-bold text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
					{smash.submission.name}
				</span>
			</div>
		</div>
	)
}
