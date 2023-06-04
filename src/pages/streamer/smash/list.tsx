import CustomHead from "../../../components/customHead"
import Header from "../../../components/header"
import { type GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../server/auth"
import TabsNavigation from "../../../components/tabsNavigation"
import { cn } from "../../../lib/utils"
import { useCallback, useMemo, useState } from "react"
import Footer from "../../../components/footer"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { createInnerTRPCContext } from "../../../server/api/trpc"
import { appRouter } from "../../../server/api/root"
import SuperJSON from "superjson"
import { api } from "../../../utils/api"
import ListSmashItem from "../../../components/smash/listItem"
import Fuse from "fuse.js"
import ButtonRadio from "../../../components/smash/buttonRadio"
import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export default function SubmissionListPage() {
	const { data: smashes } = api.smash.getSubmissionsVoted.useQuery(undefined, {
		refetchOnMount: false,
		refetchOnWindowFocus: false
	})

	const lineBorderStyle = useCallback(
		(index: number) => {
			if (!smashes || index === smashes.length - 1) {
				return ""
			}
			return "border-dark/10 border-b-2 dark:border-white/10"
		},
		[smashes]
	)

	const [voteFilter, setVoteFilter] = useState<"SMASH" | "PASS" | "all">("all")
	const [typeFilter, setTypeFilter] = useState<"TOP" | "VERSE" | "BOTTOM" | "empty" | "all">("all")

	const preFilteredSmashes = useMemo(() => {
		if (!smashes) {
			return null
		}

		if (voteFilter === "all" && typeFilter === "all") {
			return smashes
		}

		return smashes.filter((smash) => {
			if (voteFilter !== "all" && smash.vote !== voteFilter) {
				return false
			}

			if (typeFilter !== "all") {
				if (typeFilter === "empty" && smash.type !== null) {
					return false
				}

				if (typeFilter !== "empty" && smash.type !== typeFilter) {
					return false
				}
			}

			return true
		})
	}, [smashes, voteFilter, typeFilter])

	const fuse = useMemo(() => {
		if (!preFilteredSmashes) {
			return null
		}
		return new Fuse(preFilteredSmashes, {
			keys: ["submission.name", "submission.game"],
			includeScore: true
		})
	}, [preFilteredSmashes])

	const [search, setSearch] = useState("")

	const filteredSmashes = useMemo(() => {
		if (!preFilteredSmashes) {
			return null
		}

		if (!search) {
			return preFilteredSmashes
		}

		return fuse?.search(search).map((result, index) => {
			if (index < 3) {
				console.log(result)
			}
			return result.item
		})
	}, [preFilteredSmashes, search, fuse])

	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Submission list" />
			<Header />
			<TabsNavigation />
			<main className="mb-auto flex flex-col items-center p-8 pt-0">
				<section className="mt-4 w-full max-w-6xl">
					<Alert className="mb-8" variant={"warning"}>
						<ExclamationTriangleIcon className="h-4 w-4" />
						<AlertTitle>Work in progress</AlertTitle>
						<AlertDescription>
							We are working hard to implement edit and delete features for votes, please be patient ❤️
						</AlertDescription>
					</Alert>
					<div className="flex flex-col items-center">
						<div>
							<Label htmlFor="search">Search</Label>
							<Input
								id="search"
								className="mt-2"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<div className="mr-4 flex w-full justify-around">
							<ButtonRadio
								title="Vote filter"
								options={[
									{ value: "all", label: "All" },
									{ value: "SMASH", label: "Smash" },
									{ value: "PASS", label: "Pass" }
								]}
								value={voteFilter}
								onChange={({ value }) => setVoteFilter(value as "SMASH" | "PASS" | "all")}
							/>
							<ButtonRadio
								title="Type filter"
								options={[
									{ value: "all", label: "All" },
									{ value: "empty", label: "No value" },
									{ value: "TOP", label: "Top" },
									{ value: "VERSE", label: "Verse" },
									{ value: "BOTTOM", label: "Bottom" }
								]}
								value={typeFilter}
								onChange={({ value }) =>
									setTypeFilter(value as "TOP" | "VERSE" | "BOTTOM" | "empty" | "all")
								}
							/>
						</div>
					</div>
					{filteredSmashes && filteredSmashes.length > 0 ? (
						<ul>
							{filteredSmashes.map((smash, index) => (
								<li key={smash.id} className={cn("py-4", lineBorderStyle(index))}>
									<ListSmashItem smash={smash} />
								</li>
							))}
						</ul>
					) : (
						<h2 className="text-center text-xl">No smash votes yet</h2>
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

	await helpers.smash.getSubmissionsVoted.prefetch()

	return {
		props: {
			trpcState: helpers.dehydrate()
		}
	}
}
