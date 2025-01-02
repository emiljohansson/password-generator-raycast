import { Action, ActionPanel, Form } from '@raycast/api'
import { useEffect, useState } from 'react'

type Selection = {
	length: number
	numeric: boolean
	symbols: boolean
}

const lettersPattern = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numericPattern = '0123456789'
const symbolsPattern = ',._?-:]&*#~}$>(<)@^|{%!+='

const initSelection: Selection = {
	length: 20,
	numeric: false, // reversed. for some reason onChange is called on load
	symbols: true,
}

export function randomString(props: Selection) {
	const { length, numeric, symbols } = props
	const pattern = [
		lettersPattern,
		numeric && numericPattern,
		symbols && symbolsPattern,
	]
		.filter((v) => !!v)
		.join('')
	let value = ''
	let index = length

	while (index--) {
		const charIndex = Math.floor(Math.random() * pattern.length)
		value += pattern[charIndex]
	}

	return value
}

export default function Command() {
	const [randomSelection, setRandomSelection] = useState(initSelection)
	const [randomPassword, setRandomPassword] = useState(
		randomString(initSelection),
	)

	function generateNewPassword() {
		setRandomPassword(randomString(randomSelection))
	}

	function toggleNumeric() {
		randomSelection.numeric = !randomSelection.numeric
		setRandomSelection({
			...randomSelection,
		})
	}

	function toggleSymbols() {
		randomSelection.symbols = !randomSelection.symbols
		setRandomSelection({
			...randomSelection,
		})
	}

	useEffect(() => {
		generateNewPassword()
	}, [randomSelection])

	return (
		<>
			<Form
				actions={
					<ActionPanel>
						<Action.CopyToClipboard
							content={randomPassword}
							shortcut={{ modifiers: ['cmd'], key: '.' }}
						/>
					</ActionPanel>
				}
			>
				<Form.TextField
					id="length"
					value={randomSelection.length.toString()}
					onChange={(value) => {
						const newValue = Number(value)
						if (isNaN(newValue)) return
						randomSelection.length = newValue
						setRandomSelection({
							...randomSelection,
						})
					}}
				/>
				<Form.Checkbox
					id="numeric"
					label="Numbers"
					value={randomSelection.numeric}
					onChange={toggleNumeric}
				/>
				<Form.Checkbox
					id="symbols"
					label="Symbols"
					value={randomSelection.symbols}
					onChange={toggleSymbols}
				/>
				<Form.TextField
					id="password"
					value={randomPassword}
					onChange={() => {}}
				/>
			</Form>
		</>
	)
}
