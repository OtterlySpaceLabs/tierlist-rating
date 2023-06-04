interface StatsHeaderProps {
	stats: {
		name: string
		value: number
		unit?: string
	}[]
}

export default function StatsHeader({ stats }: StatsHeaderProps) {
	return (
		<div className="mx-auto mb-4 max-w-7xl">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat) => (
					<div key={stat.name} className="rounded-sm bg-sky-100 px-4 py-6 dark:bg-gray-900 sm:px-6 lg:px-8">
						<p className="text-sm font-medium leading-6 text-gray-600 dark:text-gray-400">{stat.name}</p>
						<p className="mt-2 flex items-baseline gap-x-2">
							<span className="text-4xl font-semibold tracking-tight dark:text-white">{stat.value}</span>
							{stat.unit ? (
								<span className="text-sm text-gray-600 dark:text-gray-400">{stat.unit}</span>
							) : null}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
