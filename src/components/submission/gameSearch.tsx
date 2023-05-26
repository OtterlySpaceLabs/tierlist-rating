import { type ChangeEvent, useEffect, useState } from "react"
import { useDebounce } from "usehooks-ts"
import { api } from "../../utils/api"
import { type Game } from "../../server/api/routers/igdb"
import Image from "next/image"

interface GameSearchProps {
	value?: string
	onChange?: (value: string) => void
}

export default function GameSearch({ value, onChange }: GameSearchProps) {
	const [game, setGame] = useState<string>(value ?? "")
	const [searchResults, setSearchResults] = useState<Game[]>([])
	const debouncedValue = useDebounce<string>(game, 750)
	const gameSearchMutate = api.igdb.searchGames.useMutation()

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setGame(event.target.value)
	}

	const handleSelect = (game: Game) => {
		setGame(game.name)
		onChange?.(game.name)
	}

	// Fetch API (optional)
	useEffect(() => {
		if (debouncedValue && debouncedValue.length > 2) {
			gameSearchMutate
				.mutateAsync(debouncedValue)
				.then((result) => {
					setSearchResults(result)
				})
				.catch((error) => {
					console.error(error)
				})
		} else {
			setSearchResults([])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue])

	return (
		<div className="relative">
			<input
				className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
				type="text"
				placeholder="Search for a game"
				value={game}
				onChange={handleChange}
			/>
			{searchResults.length > 0 && (
				<div className="absolute left-0 top-12 w-full rounded-xl bg-white/10 p-4">
					{searchResults.map((game) => (
						<div
							key={game.id}
							className="flex cursor-pointer items-center gap-4"
							onClick={() => void handleSelect(game)}
						>
							<Image
								unoptimized
								className="h-16 w-16 rounded-xl"
								src={game.cover?.url ?? "/images/placeholder.png"}
								alt={game.name}
								width={game.cover?.width ?? 100}
								height={game.cover?.height ?? 100}
							/>
							<div className="flex flex-col">
								<h3 className="text-xl font-bold">{game.name}</h3>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
