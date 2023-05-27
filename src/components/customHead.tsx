import Head from "next/head"
import { env } from "../env.mjs"

export default function CustomHead({ title }: { title?: string }) {
	return (
		<Head>
			<title>Smash App{title && ` - ${title}`}</title>
			<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
			<link rel="shortcut icon" href="/favicons/favicon.ico" />
			<meta name="description" content="Submit your character and have your streamer rate it!" />

			<meta property="og:title" content="Smash App" />
			<meta property="og:description" content="Submit your character and have your streamer rate it!" />
			<meta property="og:image" content={`${env.NEXT_PUBLIC_URL}/logo.png`} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={`${env.NEXT_PUBLIC_URL}`} />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:title" content="Smash App" />
			<meta property="twitter:description" content="Submit your character and have your streamer rate it!" />
			<meta property="twitter:image" content={`${env.NEXT_PUBLIC_URL}/logo.png`} />
		</Head>
	)
}
