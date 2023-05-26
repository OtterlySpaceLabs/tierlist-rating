export function getCurrentMode(): "light" | "dark" {
	if (typeof window === "undefined") return "light"

	if (!("theme" in localStorage)) {
		const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

		return prefersDarkMode ? "dark" : "light"
	}

	const theme = window.localStorage.getItem("theme") as "light" | "dark"
	return theme
}
