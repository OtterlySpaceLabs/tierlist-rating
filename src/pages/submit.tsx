import Head from "next/head"
import Header from "../components/header"
import SubmissionForm from "../components/submission/submissionForm"

export default function SubmitPage() {
	return (
		<>
			<Head>
				<title>Smash App - Submit</title>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
				<link rel="shortcut icon" href="/favicons/favicon.ico" />
			</Head>
			<Header />
			<main className="flex flex-col items-center p-8">
				<h1 className="text-center text-2xl">Submit your character</h1>
				<section className="mt-16 w-full max-w-2xl">
					<SubmissionForm />
				</section>
			</main>
		</>
	)
}
