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
import SmashHandler from "../../components/smash/smashHandler"

// props: InferGetServerSidePropsType<typeof getServerSideProps>
export default function SmashPage() {
	const {
		data: submissions,
		isLoading,
		refetch
	} = api.smash.getSubmissionsToVote.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Smash" />
			<Header />
			<TabsNavigation />
			<main className="my-auto flex min-h-max flex-col items-center p-8">
				<section className="mt-8 w-full max-w-4xl">
					{!isLoading && submissions ? (
						<SmashHandler submissions={submissions} refetch={() => void refetch()} />
					) : (
						<div>Loading...</div>
					)}
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

	await helpers.smash.getSubmissionsToVote.prefetch()

	return {
		props: {
			trpcState: helpers.dehydrate()
		}
	}
}
