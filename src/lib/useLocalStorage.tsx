import { type SetStateAction, useState, useEffect } from "react"

type SetValueFunction<T> = (value: SetStateAction<T>, saveInLocalStorage?: boolean) => void

function useLocalStorage<T = string>(key: string, initialValue: T): [T, SetValueFunction<T>] {
	const [state, setState] = useState<T>(() => initialValue)

	useEffect(() => {
		try {
			const value = window.localStorage.getItem(key)
			// Check if the local storage already has any values,
			// otherwise initialize it with the passed initialValue
			const parsedValue: T = value ? (JSON.parse(value) as T) : initialValue

			setState(parsedValue)
		} catch (error) {
			if (typeof window !== "undefined") {
				console.log(error)
			}
		}
	}, [key, initialValue])

	const setValue: SetValueFunction<T> = (value, saveInLocalStorage = true) => {
		try {
			// If the passed value is a callback function,
			//  then call it with the existing state.
			const valueToStore = value instanceof Function ? value(state) : value
			if (saveInLocalStorage) {
				window.localStorage.setItem(key, JSON.stringify(valueToStore))
			}
			setState(value)
		} catch (error) {
			console.log(error)
		}
	}

	return [state, setValue]
}

export default useLocalStorage
