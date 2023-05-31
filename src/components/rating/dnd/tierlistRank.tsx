import { type TierlistRank } from "@prisma/client"
import { type SmashWithSubmissionAndAuthor } from "../../../server/api/routers/smash/smash.interface"
import TierlistCardDnd from "./tierlistCard"
import { useDrop } from "react-dnd"
import { useTierlistStore } from "../tierlistStore"
import { useMemo } from "react"
import { cn } from "../../../lib/utils"
import { api } from "../../../utils/api"

interface TierlistRankProps {
	rank: TierlistRank
	entries: SmashWithSubmissionAndAuthor[]
}

const rankColors = {
	"0": "bg-red-300",
	"1": "bg-orange-300",
	"2": "bg-yellow-400",
	"3": "bg-yellow-300",
	"4": "bg-green-300",
	"5": "bg-green-400",
	"6": "bg-sky-300",
	"7": "bg-blue-300"
}

export default function TierlistRankContainer({ rank, entries }: TierlistRankProps) {
	const [addRankEntry, udpateRankEntry, isRanked, rankedSmashes] = useTierlistStore((store) => [
		store.addRankEntry,
		store.udpateRankEntry,
		store.isRanked,
		store.rankedSmashes
	])

	const addRankEntryMutation = api.rank.addRankEntry.useMutation()
	const updateRankEntryMutation = api.rank.updateRankEntry.useMutation()

	const [{ isOver }, drop] = useDrop({
		accept: "SMASH",
		drop: async (item: SmashWithSubmissionAndAuthor) => {
			if (isRanked(item.id)) {
				const rankedSmash = [...rankedSmashes].find((smash) => smash.smashId === item.id)
				if (!rankedSmash) return
				const updateRankEntryValue = await updateRankEntryMutation.mutateAsync({
					id: rankedSmash.rankEntryId,
					rankId: rank.id
				})
				udpateRankEntry(item.id, rank.id, updateRankEntryValue.id)
			} else {
				const addRankEntryValue = await addRankEntryMutation.mutateAsync({
					smashId: item.id,
					rankId: rank.id,
					index: entries.length
				})
				addRankEntry(item.id, rank.id, addRankEntryValue.id)
			}
		},
		collect: (monitor) => ({
			isOver: !!monitor.isOver()
		})
	})

	const rankColor = useMemo<string>(() => {
		if (`${rank.order}` in rankColors) {
			// @ts-expect-error rankColors is a string indexable object
			return rankColors[`${rank.order}`] as string
		}
		return "bg-blue-50"
	}, [rank.order])

	return (
		<div ref={drop} className="flex min-h-[7rem] rounded-sm bg-slate-300/20">
			<div className={cn("flex w-32 items-center justify-center rounded-l-sm text-black", rankColor)}>
				<span>{rank.name}</span>
			</div>
			<div
				className={cn(
					"flex min-h-full w-full gap-2 rounded-r-sm p-2 transition-colors",
					isOver && "bg-white/30"
				)}
			>
				{entries.map((entry) => (
					<TierlistCardDnd key={entry.id} smash={entry} />
				))}
			</div>
		</div>
	)
}
