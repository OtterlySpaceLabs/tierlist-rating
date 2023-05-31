import { type RankEntry, type Tierlist, type TierlistRank } from "@prisma/client"
import { create } from "zustand"
import { type SmashWithSubmissionAndAuthor } from "../../server/api/routers/smash/smash.interface"

export interface TierlistStore {
	tierlist: Tierlist | null
	ranks: TierlistRank[]
	smashes: SmashWithSubmissionAndAuthor[]
	rankedSmashes: Set<{ smashId: string; rankId: string; index: number }>
	rankEntryToSmash: Set<{ smashId: string; rankEntryId: string }>
	setTierlist: (tierlist: Tierlist & { ranks: TierlistRank[] }) => void
	setRanks: (ranks: TierlistRank[]) => void
	setSmashes: (smashes: SmashWithSubmissionAndAuthor[]) => void
	loadRanksEntries: (rankEntries: RankEntry[]) => void
	addRankEntry: (smashId: string, rankId: string, index?: number) => void
	addRankEntryToSmashRef: (smashId: string, rankEntryId: string) => void
	udpateRankEntry: (smashId: string, rankId: string, index?: number) => void
	updateRankEntryToSmashRef: (smashId: string, rankEntryId: string) => void
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
	rankEntryToSmash: new Set(),
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
				index: entry.index
			}))
		)
		const newRankEntryToSmash = new Set(
			rankEntries.map((entry) => ({
				smashId: entry.smashEntryId,
				rankEntryId: entry.id
			}))
		)
		set({ rankedSmashes: newRankedSmashes, rankEntryToSmash: newRankEntryToSmash })
	},
	addRankEntry: (smashId, rankId, index) => {
		const { rankedSmashes } = get()
		rankedSmashes.add({ smashId, rankId, index: index ?? rankedSmashes.size })
		set({ rankedSmashes })
	},
	udpateRankEntry: (smashId, rankId, index) => {
		const { rankedSmashes } = get()
		const currentEntry = [...rankedSmashes].find((entry) => entry.smashId === smashId)
		if (!currentEntry) {
			throw new Error("Rank entry does not exist.")
		}
		rankedSmashes.delete(currentEntry)
		rankedSmashes.add({ smashId, rankId, index: index ?? rankedSmashes.size })
		set({ rankedSmashes })
	},
	addRankEntryToSmashRef: (smashId, rankEntryId) => {
		const { rankEntryToSmash } = get()
		rankEntryToSmash.add({ smashId, rankEntryId })
		set({ rankEntryToSmash })
	},
	updateRankEntryToSmashRef: (smashId, rankEntryId) => {
		const { rankEntryToSmash } = get()
		const currentEntry = [...rankEntryToSmash].find((entry) => entry.smashId === smashId)
		if (!currentEntry) {
			throw new Error("Rank entry does not exist.")
		}
		rankEntryToSmash.delete(currentEntry)
		rankEntryToSmash.add({ smashId, rankEntryId })
		set({ rankEntryToSmash })
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
