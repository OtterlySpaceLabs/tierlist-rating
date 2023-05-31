import { DndProvider } from "react-dnd"
import TierlistCardDnd from "./dnd/tierlistCard"
import { useTierlistStore } from "./tierlistStore"
import { HTML5Backend } from "react-dnd-html5-backend"
import TierlistRankContainer from "./dnd/tierlistRank"
import { useCallback } from "react"

export default function TierlistHandler() {
	const { tierlist, ranks, getEntriesForRank, getNonRankedSmashes } = useTierlistStore(
		({ tierlist, ranks, getEntriesForRank, getNonRankedSmashes }) => ({
			tierlist,
			ranks,
			getEntriesForRank,
			getNonRankedSmashes
		})
	)

	const rankEntries = useCallback(
		(rankId: string) => {
			const entries = getEntriesForRank(rankId)
			return entries
		},
		[getEntriesForRank]
	)

	const nonRankedSmashes = useCallback(() => {
		const result = getNonRankedSmashes()
		return result
	}, [getNonRankedSmashes])

	return (
		<div>
			{tierlist && (
				<DndProvider backend={HTML5Backend}>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							{ranks.map((rank) => (
								<TierlistRankContainer key={rank.id} rank={rank} entries={rankEntries(rank.id)} />
							))}
						</div>

						<div className="flex flex-wrap justify-center gap-4">
							{nonRankedSmashes().map((smash) => (
								<TierlistCardDnd key={smash.id} smash={smash} />
							))}
						</div>
					</div>
				</DndProvider>
			)}
		</div>
	)
}
