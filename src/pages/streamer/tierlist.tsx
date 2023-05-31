import { type GetServerSideProps } from "next"
import { createServerSideHelpers } from "@trpc/react-query/server"
import CustomHead from "../../components/customHead"
import Footer from "../../components/footer"
import Header from "../../components/header"
import TabsNavigation from "../../components/tabsNavigation"
import { appRouter } from "../../server/api/root"
import SuperJSON from "superjson"
import { createInnerTRPCContext } from "../../server/api/trpc"
import { authOptions } from "../../server/auth"
import { getServerSession } from "next-auth"
import { api } from "../../utils/api"
import { useEffect, useMemo } from "react"
import { useTierlistStore } from "../../components/rating/tierlistStore"
import TierlistHandler from "../../components/rating/tierlistHandler"

// props: InferGetServerSidePropsType<typeof getServerSideProps>
export default function TierlistPage() {
	const {
		data: fetchedSmashes,
		isLoading: isSmashesLoading,
		refetch: refetchSmashes
	} = api.rank.getEntriesToRank.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	const {
		data: fetchedTierlist,
		isLoading: isTierlistLoading,
		refetch: refetchTierlist
	} = api.rank.getTierlist.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	const {
		data: rankEntries,
		isLoading: isRankEntriesLoading,
		refetch: refetchRankEntries
	} = api.rank.getRankEntries.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	const isLoading = useMemo(
		() => isSmashesLoading || isTierlistLoading || isRankEntriesLoading,
		[isSmashesLoading, isTierlistLoading, isRankEntriesLoading]
	)

	const [setTierlist, loadRanksEntries, setSmashes] = useTierlistStore((state) => [
		state.setTierlist,
		state.loadRanksEntries,
		state.setSmashes
	])

	useEffect(() => {
		if (!isLoading && fetchedTierlist && rankEntries && fetchedSmashes) {
			setTierlist(fetchedTierlist)
			loadRanksEntries(rankEntries)
			setSmashes(fetchedSmashes)
		}
	}, [isLoading, fetchedTierlist, rankEntries, fetchedSmashes, setTierlist, loadRanksEntries, setSmashes])

	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Smash" />
			<Header />
			<TabsNavigation />
			<main className="my-auto flex min-h-max flex-col items-center p-8">
				<section className="mt-8 w-full max-w-4xl">
					<TierlistHandler />
				</section>
			</main>
			<Footer />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user || !session.user.isStreamer) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const helpers = createServerSideHelpers({
		router: appRouter,
		ctx: createInnerTRPCContext({
			session
		}),
		transformer: SuperJSON
	})

	await helpers.rank.getEntriesToRank.prefetch()
	await helpers.rank.getTierlist.prefetch()
	await helpers.rank.getRankEntries.prefetch()

	return {
		props: {
			trpcState: helpers.dehydrate()
		}
	}
}
