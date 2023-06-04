import Header from "../../../../components/header"
import CustomHead from "../../../../components/customHead"
import TabsNavigation from "../../../../components/tabsNavigation"
import Footer from "../../../../components/footer"
import { type GetServerSideProps } from "next"
import { prisma } from "../../../../server/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../server/auth"
import { type Submission } from "@prisma/client"
import SubmissionEditForm from "../../../../components/submission/submissionEditForm"

interface SubmitEditPageProps {
	id: string
	submission: Submission
}

export default function SubmitEditPage({ submission }: SubmitEditPageProps) {
	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Submit" />
			<Header />
			<TabsNavigation />
			<main className="mb-auto flex flex-col items-center p-8 pt-0">
				<section className="mt-8 w-full max-w-2xl">
					<SubmissionEditForm submission={submission} />
				</section>
			</main>
			<Footer />
		</div>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const { id } = context.query
	if (typeof id !== "string") {
		return {
			notFound: true
		}
	}

	const session = await getServerSession(context.req, context.res, authOptions)

	if (!session?.user) {
		return {
			redirect: {
				destination: "/",
				permanent: false
			}
		}
	}

	const submission = await prisma.submission.findUnique({
		where: {
			id
		}
	})

	if (!submission) {
		return {
			notFound: true
		}
	}

	if (submission.authorId !== session.user.id && !session.user.isModerator) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			id,
			submission
		}
	}
}
