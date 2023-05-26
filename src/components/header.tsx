import ThemeToggle from "./themeToggle"

export default function Header() {
	return (
		<header>
			<nav className="mx-auto flex items-center justify-between p-8">
				<div className="flex lg:flex-1">
					<a href="#" className="-m-1.5 p-1.5">
						<span>Tierlist</span>
					</a>
				</div>
				<div className="flex flex-1 justify-end">
					<ThemeToggle />
				</div>
			</nav>
		</header>
	)
}
