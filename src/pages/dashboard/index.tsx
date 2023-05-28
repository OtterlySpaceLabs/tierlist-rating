import CustomHead from "../../components/customHead"
import Header from "../../components/header"
import TabsNavigation from "../../components/tabsNavigation"
import { cn } from "../../lib/utils"
import { useCallback, useState } from "react"
import { api } from "../../utils/api"
import Footer from "../../components/footer"
import ListItem from "../../components/list/listItem"
import { type Submission } from "@prisma/client"
import DeleteDialog from "../../components/list/deleteDialog"

export default function SubmissionListPage() {
	const { data: submissions, refetch } = api.submission.listAll.useQuery()

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

	const handleStatusChange = useCallback(() => {
		void refetch()
	}, [refetch])

	const [showDeleteDialog, setShowDeleteDialog] = useState(false)
	const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null)

	const showDeleteDialogHandler = useCallback(
		(submission: Submission) => {
			if (showDeleteDialog) {
				return
			}
			setSubmissionToDelete(submission)
			setShowDeleteDialog(true)
		},
		[showDeleteDialog]
	)

	const hideDeleteDialogHandler = useCallback(
		(isDeleted?: boolean) => {
			if (isDeleted) {
				void refetch()
			}
			setShowDeleteDialog(false)
			setSubmissionToDelete(null)
		},
		[refetch]
	)

	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Submission list" />
			<Header />
			<TabsNavigation />
			<main className="mb-auto flex flex-col items-center p-8 pt-0">
				<section className="mt-8 w-full max-w-6xl">
					{submissions && submissions.length > 0 ? (
						<>
							<DeleteDialog
								open={showDeleteDialog}
								submission={submissionToDelete}
								onClose={hideDeleteDialogHandler}
							/>
							<ul>
								{submissions.map((submission, index) => (
									<li key={submission.id} className={cn("py-4", lineBorderStyle(index))}>
										<ListItem
											submission={submission}
											moderationMode
											onStatusChange={() => void handleStatusChange()}
											showDeleteDialog={showDeleteDialogHandler}
										/>
									</li>
								))}
							</ul>
						</>
					) : (
						<h2 className="text-center text-xl">No submissions yet</h2>
					)}
				</section>
			</main>
			<Footer />
		</div>
	)
}
