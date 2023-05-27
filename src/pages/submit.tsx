import Header from "../components/header"
import SubmissionForm from "../components/submission/submissionForm"
import CustomHead from "../components/customHead"

export default function SubmitPage() {
	return (
		<>
			<CustomHead title="Submit" />
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
