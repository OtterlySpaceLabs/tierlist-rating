import { useMemo } from "react"
import { Switch } from "@headlessui/react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "../lib/ThemeProvider"

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ")
}

export default function ThemeToggle() {
	const { theme, switchTheme } = useTheme()
	const enabled = useMemo(() => theme === "dark", [theme])

	return (
		<Switch
			checked={enabled}
			onChange={switchTheme}
			className={classNames(
				enabled ? "bg-orange-600" : "bg-gray-200",
				"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
			)}
		>
			<span className="sr-only">Use setting</span>
			<span
				className={classNames(
					enabled ? "translate-x-5" : "translate-x-0",
					"pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
				)}
			>
				<span
					className={classNames(
						enabled ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<SunIcon size={16} className="h-3 w-3 text-gray-400" />
				</span>
				<span
					className={classNames(
						enabled ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out",
						"absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
					)}
					aria-hidden="true"
				>
					<MoonIcon size={16} className="h-3 w-3 text-orange-400" />
				</span>
			</span>
		</Switch>
	)
}
