import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

export default function TabsNavigation() {
	const router = useRouter()
	const { data: sessionData } = useSession()

	const tabs = useMemo(
		() => [
			{ name: "New submission", href: "/submit", current: router.pathname === "/submit", show: true },
			{ name: "My submissions", href: "/submit/list", current: router.pathname === "/submit/list", show: true },
			{
				name: "Moderation",
				href: "/dashboard",
				current: router.pathname === "/dashboard",
				show: sessionData?.user.isModerator
			},
			{
				name: "Smash or Pass",
				href: "/streamer/smash",
				current: router.pathname === "/streamer/smash",
				show: sessionData?.user.isStreamer
			},
			{
				name: "Tierlist",
				href: "/streamer/tierlist",
				current: router.pathname === "/streamer/tierlist",
				show: sessionData?.user.isStreamer
			}
		],
		[router.pathname, sessionData?.user.isModerator, sessionData?.user.isStreamer]
	)
	return (
		<div className="px-4 pb-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				{/* <div className="sm:hidden">
					<label htmlFor="tabs" className="sr-only">
						Select a tab
					</label>
					<select
						id="tabs"
						name="tabs"
						className="block w-full rounded-md border-none bg-white/5 py-2 pl-3 pr-10 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm"
						defaultValue={tabs.find((tab) => tab.current)?.name ?? ""}
						onChange={(e) => void router.push(e.target.value)}
					>
						{tabs
							.filter((tab) => tab.show)
							.map((tab) => (
								<option key={tab.name}>{tab.name}</option>
							))}
					</select>
				</div> */}
				<div className="block">
					<nav className="flex overflow-x-auto border-b border-gray-300 py-4 dark:border-white/10">
						<ul
							role="list"
							className="flex min-w-full flex-none justify-around gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400 sm:justify-normal"
						>
							{tabs
								.filter((tab) => tab.show)
								.map((tab) => (
									<li key={tab.name}>
										<Link href={tab.href} className={tab.current ? "text-orange-400" : ""}>
											{tab.name}
										</Link>
									</li>
								))}
						</ul>
					</nav>
				</div>
			</div>
		</div>
	)
}
