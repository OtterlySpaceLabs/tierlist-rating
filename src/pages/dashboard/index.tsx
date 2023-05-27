import { type Submission } from "@prisma/client"
import CustomHead from "../../components/customHead"
import Header from "../../components/header"
import Image from "next/image"
import TabsNavigation from "../../components/tabsNavigation"
import { cn } from "../../lib/utils"
import { useCallback } from "react"
import { api } from "../../utils/api"

export default function SubmissionListPage() {
	const { data: submissions } = api.submission.listAll.useQuery()

	const statusBadgeStyle = useCallback((submission: Submission) => {
		switch (submission.status) {
			case "PENDING":
				return "bg-yellow-200 text-yellow-800"
			case "APPROVED":
				return "bg-green-200 text-green-800"
			case "REJECTED":
				return "bg-red-200 text-red-800"
		}
	}, [])

	const lineBorderStyle = useCallback(
		(index: number) => {
			if (!submissions) {
				return ""
			}
			if (index === submissions.length - 1) {
				return ""
			}
			return "border-dark/10 border-b-2 dark:border-white/10"
		},
		[submissions]
	)

	return (
		<>
			<CustomHead title="Submission list" />
			<Header />
			<TabsNavigation />
			<main className="flex flex-col items-center p-8 pt-0">
				<section className="mt-8 w-full max-w-6xl">
					{submissions && submissions.length > 0 ? (
						<ul>
							{submissions.map((submission, index) => (
								<li key={submission.id} className={cn("py-4", lineBorderStyle(index))}>
									<div className="flex flex-col justify-center sm:flex-row sm:justify-normal">
										<div className="h[200px] w[200px] flex justify-center object-contain align-middle">
											<Image
												unoptimized
												src={submission.image}
												alt={submission.name}
												width={200}
												height={200}
											/>
										</div>

										<div className="flex flex-col justify-center sm:px-8">
											<span className="text-lg font-semibold">{submission.name}</span>
											<span className="italic">{submission.game}</span>
											<span className="pt-2">
												<span className="font-semibold">By:</span>
												<span className="ml-1">{submission.author.name}</span>
											</span>
											<span className="pt-2">
												<span className="font-semibold">Status:</span>
												<span
													className={cn(
														"ml-2 rounded-full px-2 py-1 text-sm font-semibold capitalize",
														statusBadgeStyle(submission)
													)}
												>
													{submission.status.toLowerCase()}
												</span>
											</span>
										</div>
									</div>
								</li>
							))}
						</ul>
					) : (
						<h2 className="text-center text-xl">No submissions yet</h2>
					)}
				</section>
			</main>
		</>
	)
}
