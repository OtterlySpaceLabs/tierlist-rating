import { RadioGroup } from "@headlessui/react"
import { useMemo } from "react"
import { cn } from "../../lib/utils"

interface ButtonRadioProps {
	title?: string
	options: {
		label: string
		value: string
	}[]
	onChange?: (value: { label: string; value: string }) => void
	value?: { label: string; value: string } | string
}

export default function ButtonRadio({ title, options, onChange, value }: ButtonRadioProps) {
	const currentValue = useMemo<{ label: string; value: string } | null>(
		() =>
			value
				? typeof value === "string"
					? options.find((option) => option.value === value) || null
					: value
				: null,
		[value, options]
	)

	const handleChange = (val: { label: string; value: string }) => {
		onChange?.(val)
	}

	return (
		<div className="mb-4 flex flex-col items-center justify-center">
			{title && (
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">{title}</h2>
				</div>
			)}
			<RadioGroup value={currentValue} onChange={handleChange} className="mt-4">
				<div className="flex justify-between gap-3">
					{options.map((option) => (
						<RadioGroup.Option
							key={option.label}
							value={option}
							className={({ active, checked }) =>
								cn(
									active ? "ring-2 ring-orange-600 ring-offset-2" : "",
									checked
										? "bg-orange-600 text-white hover:bg-orange-500"
										: "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
									"text-md flex min-w-[4rem] cursor-pointer items-center justify-center rounded-md px-3 py-3 font-semibold focus:outline-none sm:flex-1"
								)
							}
						>
							<RadioGroup.Label as="span">{option.label}</RadioGroup.Label>
						</RadioGroup.Option>
					))}
				</div>
			</RadioGroup>
		</div>
	)
}
