import Header from "../../../../components/header"
import CustomHead from "../../../../components/customHead"
import TabsNavigation from "../../../../components/tabsNavigation"
import Footer from "../../../../components/footer"
import { type GetServerSideProps } from "next"
import { prisma } from "../../../../server/db"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../server/auth"
import SmashEditForm from "../../../../components/smash/smashEditForm"
import { type SmashWithSubmissionAndAuthor } from "../../../../server/api/routers/smash/smash.interface"

interface SmashEditPageProps {
	id: string
	smash: SmashWithSubmissionAndAuthor
}

export default function SmashEditPage({ smash }: SmashEditPageProps) {
	return (
		<div className="flex h-screen flex-col">
			<CustomHead title="Smash" />
			<Header />
			<TabsNavigation />
			<main className="my-auto flex min-h-max flex-col items-center p-8">
				<section className="mt-8 w-full max-w-4xl">
					<SmashEditForm smash={smash} />
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

	const smash = await prisma.smashEntry.findUnique({
		where: {
			id
		},
		include: {
			submission: {
				include: {
					author: {
						select: {
							id: true,
							name: true,
							image: true
						}
					}
				}
			}
		}
	})

	if (!smash) {
		return {
			notFound: true
		}
	}

	if (smash.authorId !== session.user.id && !session.user.isModerator) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			id,
			smash
		}
	}
}
