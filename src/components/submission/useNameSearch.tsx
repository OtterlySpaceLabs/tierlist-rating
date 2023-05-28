import { useState } from "react"
import { useDebounce } from "usehooks-ts"
import { api } from "../../utils/api"

export default function useNameSearch() {
	const [searchInput, setSearchInput] = useState<string>("")

	const debouncedValue = useDebounce<string>(searchInput, 500)

	const { data: searchResults } = api.submission.listSimilar.useQuery(
		{
			name: debouncedValue
		},
		{
			enabled: debouncedValue.length > 2
		}
	)

	return {
		searchResults,
		setSearchInput
	}
}
