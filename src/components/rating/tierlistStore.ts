import { type RankEntry, type Tierlist, type TierlistRank } from "@prisma/client"
import { create } from "zustand"
import { type SmashWithSubmissionAndAuthor } from "../../server/api/routers/smash/smash.interface"

export interface TierlistStore {
	tierlist: Tierlist | null
	ranks: TierlistRank[]
	smashes: SmashWithSubmissionAndAuthor[]
	rankedSmashes: Set<{ smashId: string; rankId: string; rankEntryId: string; index: number }>
	setTierlist: (tierlist: Tierlist & { ranks: TierlistRank[] }) => void
	setRanks: (ranks: TierlistRank[]) => void
	setSmashes: (smashes: SmashWithSubmissionAndAuthor[]) => void
	loadRanksEntries: (rankEntries: RankEntry[]) => void
	addRankEntry: (smashId: string, rankId: string, rankEntryId: string, index?: number) => void
	udpateRankEntry: (smashId: string, rankId: string, rankEntryId: string, index?: number) => void
	removeRankEntry: (smashId: string) => void
	getEntriesForRank: (rankId: string) => SmashWithSubmissionAndAuthor[]
	getNonRankedSmashes: () => SmashWithSubmissionAndAuthor[]
	isRanked: (smashId: string) => boolean
}

export const useTierlistStore = create<TierlistStore>()((set, get) => ({
	tierlist: null,
	ranks: [],
	smashes: [],
	rankedSmashes: new Set(),
	setTierlist: ({ ranks, ...tierlist }) => {
		set({ tierlist })
		set({ ranks: ranks })
	},
	setRanks: (ranks) => set({ ranks }),
	setSmashes: (smashes) => set({ smashes }),
	loadRanksEntries: (rankEntries) => {
		const newRankedSmashes = new Set(
			rankEntries.map((entry) => ({
				smashId: entry.smashEntryId,
				rankId: entry.rankId,
				rankEntryId: entry.id,
				index: entry.index
			}))
		)
		set({ rankedSmashes: newRankedSmashes })
	},
	addRankEntry: (smashId, rankId, rankEntryId, index) => {
		const { rankedSmashes } = get()
		rankedSmashes.add({ smashId, rankId, rankEntryId, index: index ?? rankedSmashes.size })
		set({ rankedSmashes })
	},
	udpateRankEntry: (smashId, rankId, rankEntryId, index) => {
		const { rankedSmashes } = get()
		const currentEntry = [...rankedSmashes].find((entry) => entry.smashId === smashId)
		if (!currentEntry) {
			throw new Error("Rank entry does not exist.")
		}
		rankedSmashes.delete(currentEntry)
		rankedSmashes.add({ smashId, rankId, rankEntryId, index: index ?? rankedSmashes.size })
		set({ rankedSmashes })
	},
	removeRankEntry: (smashId) => {
		const { rankedSmashes } = get()
		const currentEntry = [...rankedSmashes].find((entry) => entry.smashId === smashId)
		if (!currentEntry) {
			throw new Error("Rank entry does not exist.")
		}
		rankedSmashes.delete(currentEntry)
		set({ rankedSmashes })
	},
	getEntriesForRank: (rankId) => {
		const { rankedSmashes, smashes } = get()
		const entries = [...rankedSmashes].filter((entry) => entry.rankId === rankId)
		return entries
			.map((entry) => smashes.find((s) => s.id === entry.smashId))
			.filter(Boolean) as SmashWithSubmissionAndAuthor[]
	},
	getNonRankedSmashes: () => {
		const { rankedSmashes, smashes } = get()
		const rankedSmashIds = [...rankedSmashes].map((entry) => entry.smashId)
		const filtered = smashes.filter((s) => !rankedSmashIds.includes(s.id))
		return filtered
	},
	isRanked: (smashId) => {
		const { rankedSmashes } = get()
		return [...rankedSmashes].some((entry) => entry.smashId === smashId)
	}
}))
