import { type Submission } from "@prisma/client"
import CustomHead from "../../components/customHead"
import Header from "../../components/header"
import { type GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../server/auth"
import { prisma } from "../../server/db"
import TabsNavigation from "../../components/tabsNavigation"
import { cn } from "../../lib/utils"
import { useCallback, useState } from "react"
import Footer from "../../components/footer"
import ListItem from "../../components/list/listItem"
import { useRouter } from "next/router"
import DeleteDialog from "../../components/list/deleteDialog"

interface SubmissionListPageProps {
	submissions: Submission[]
}

export default function SubmissionListPage({ submissions }: SubmissionListPageProps) {
	const router = useRouter()
	const lineBorderStyle = useCallback(
		(index: number) => {
			if (index === submissions.length - 1) {
				return ""
			}
			return "border-dark/10 border-b-2 dark:border-white/10"
		},
		[submissions]
	)

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
				void router.replace(router.asPath)
			}
			setShowDeleteDialog(false)
			setSubmissionToDelete(null)
		},
		[router]
	)

	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Submission list" />
			<Header />
			<TabsNavigation />
			<main className="mb-auto flex flex-col items-center p-8 pt-0">
				<section className="mt-8 w-full max-w-6xl">
					{submissions.length > 0 ? (
						<>
							<DeleteDialog
								open={showDeleteDialog}
								submission={submissionToDelete}
								onClose={hideDeleteDialogHandler}
							/>
							<ul>
								{submissions.map((submission, index) => (
									<li key={submission.id} className={cn("py-4", lineBorderStyle(index))}>
										<ListItem submission={submission} showDeleteDialog={showDeleteDialogHandler} />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const submissions = await prisma.submission.findMany({
		where: {
			authorId: session.user.id
		}
	})

	return {
		props: {
			submissions: submissions
		}
	}
}
