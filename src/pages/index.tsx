import { type GetServerSideProps, type NextPage } from "next"
import Head from "next/head"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { getServerSession } from "next-auth"
import { authOptions } from "../server/auth"
import Header from "../components/header"
import Image from "next/image"

const Home: NextPage = () => {
	const { data: sessionData } = useSession()
	const router = useRouter()

	if (sessionData?.user) {
		void router.push("/submit")
	}

	return (
		<>
			<Head>
				<title>Smash App</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
				<link rel="shortcut icon" href="/favicons/favicon.ico" />
			</Head>
			<div className="flex h-screen flex-col">
				<Header />
				<main className="flex h-full flex-col items-center justify-center pb-24 align-middle">
					<Image
						src="/logo.png"
						alt="Smash App Logo"
						width={200}
						height={200}
						className="mb-4 rounded-full"
					/>
					<h1 className="text-center text-4xl font-bold">Get your crush game character in!</h1>
					<p className="mt-4 text-center text-xl">
						Submit your character and have your streamer react to it!
					</p>
					<button
						className="mt-8 inline-flex items-center rounded-md bg-purple-700 px-4 py-2 text-lg font-semibold text-white hover:bg-purple-600"
						onClick={() => void signIn("twitch")}
					>
						<Image
							unoptimized
							src="/twitch.svg"
							className="-ml-1 mr-2 h-8 w-8 text-white"
							alt="Twitch logo"
							width={32}
							height={32}
						/>
						<span className="pb-1">Sign in with Twitch</span>
					</button>
				</main>
			</div>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getServerSession(context.req, context.res, authOptions)

	if (session?.user) {
		return {
			redirect: {
				destination: "/submit",
				permanent: false
			}
		}
	}

	return {
		props: {}
	}
}

export default Home
