import { useDrag } from "react-dnd"
import { type SmashWithSubmissionAndAuthor } from "../../../server/api/routers/smash/smash.interface"
import Image from "next/image"
import { cn } from "../../../lib/utils"

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

	return (
		<div
			ref={dragRef}
			className={cn("group flex cursor-pointer flex-col items-center justify-center", {
				"opacity-50": opacity < 1
			})}
		>
			<div className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-gray-700">
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
