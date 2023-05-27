import Image from "next/image"
import ThemeToggle from "./themeToggle"
import HeaderProfile from "./headerProfile"

export default function Header() {
	return (
		<header>
			<nav className="mx-auto flex items-center justify-between p-8 align-middle">
				<div className="flex lg:flex-1">
					<Image src="/logo.png" alt="Smash App" width={32} height={32} />
				</div>
				<div className="flex flex-1 justify-end"></div>
				<div className="flex flex-1 items-center justify-end">
					<ThemeToggle />
					<HeaderProfile />
				</div>
			</nav>
		</header>
	)
}
