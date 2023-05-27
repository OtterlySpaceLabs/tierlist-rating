import Header from "../../components/header"
import SubmissionForm from "../../components/submission/submissionForm"
import CustomHead from "../../components/customHead"
import TabsNavigation from "../../components/tabsNavigation"

export default function SubmitPage() {
	return (
		<>
			<CustomHead title="Submit" />
			<Header />
			<TabsNavigation />
			<main className="flex flex-col items-center p-8 pt-0">
				<section className="mt-8 w-full max-w-2xl">
					<SubmissionForm />
				</section>
			</main>
		</>
	)
}
