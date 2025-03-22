const leftCol = document.getElementById("left-col")
const rightCol = document.getElementById("right-col")
const answerInput = document.getElementById("answer")
const settings = document.querySelectorAll(
	"body > section:first-of-type ul li input"
)
const difficultyLevels = ["easy", "medium"]
const operators = {
	add: "+",
	sub: "-",
	mult: "*",
	div: "/",
}

// ORDER OF OPERATIONS
// ()
// ^2
// *
// /
// +
// -

const initPuzzle = () => {
	console.log("initiliasing puzzle")

	const [setTypes, setDifficulty] = setSettings()
	console.log(setTypes)

	if (setTypes.length == 0 || setDifficulty.length == 0) {
		console.log("select settings")
		return false
	}

	let setOperators = []
	setTypes.forEach((type) => {
		if (type in operators) {
			setOperators.push(operators[type])
		}
	})

	let placedX = false
	let lastNumber = false
	let lastOperator = false

	if (!placedX) {
		insertX(leftCol)
		placedX = true
	}

	switch (setDifficulty) {
		case "easy":
			lastNumber = insertNumber(rightCol, lastNumber, lastOperator)
			lastOperator = insertOperator(
				rightCol,
				setOperators,
				lastNumber,
				lastOperator
			)
			lastNumber = insertNumber(rightCol, lastNumber, lastOperator)
			break

		case "medium":
			break
	}
}

const insertNumber = (column, lastNumber, lastOperator) => {
	const span = document.createElement("span")
	let number = Math.floor(Math.random() * 10 + 1)
	if (lastNumber && lastNumber < number && lastOperator == "-") {
		number = Math.floor(Math.random() * lastNumber + 1)
	} else if (lastOperator == "/") {
		let factors = []
		for (let i = 1; i <= lastNumber; i++) {
			// Only if no remainder
			if (lastNumber % i === 0) {
				factors.push(i)
			}
		}

		number = factors[Math.floor(Math.random() * (factors.length - 1)) + 1]
		if (lastNumber == 1) {
			number = 1
		}
	}

	span.innerHTML = number
	column.appendChild(span)
	return number
}

const insertOperator = (column, op, lastNumber, lastOperator) => {
	const span = document.createElement("span")
	const operator = op[Math.floor(Math.random() * op.length)]
	span.innerHTML = operator
	column.appendChild(span)
	return operator
}

const insertX = (column) => {
	const span = document.createElement("span")
	span.innerHTML = "x"
	return column.appendChild(span)
}

const setSettings = () => {
	let setTypes = []
	let setDifficulty = "easy"

	settings.forEach((setting) => {
		if (setting.type == "checkbox" && setting.checked) {
			setTypes.push(setting.id)
		} else if (setting.type == "radio" && setting.checked) {
			setDifficulty = setting.id
		}
	})
	console.log("settings" + setTypes + setDifficulty)
	return [setTypes, setDifficulty]
}

const resetPuzzle = () => {
	console.log("Resetting puzzle")

	while (leftCol.firstChild) {
		leftCol.removeChild(leftCol.lastChild)
	}
	while (rightCol.firstChild) {
		rightCol.removeChild(rightCol.lastChild)
	}
}

const validatePuzzle = (input) => {
	const spans = rightCol.querySelectorAll("span")
	let components = []
	spans.forEach((span) => {
		components.push(span.textContent)
	})
	const calc = components.join("")

	try {
		const result = eval(calc)
		if (result == input) {
			return true
		} else {
			return false
		}
	} catch (err) {
		console.error("Invalid expression:", err)
		return false
	}
}

const submitAnswer = () => {
	const answer = answerInput.value
	const result = validatePuzzle(answer)
	if (result) {
		console.log("Correct")
		answerInput.value = ""
		resetPuzzle()
		initPuzzle()
	} else {
		console.log("False")
		answerInput.value = ""
	}
}

document.getElementById("reset").onclick = () => {
	resetPuzzle()

	initPuzzle()
}

document.getElementById("submit").onclick = () => {
	submitAnswer()
}

document.onkeyup = (e) => {
	if (e.key == "Enter") {
		submitAnswer()
	}
}

answerInput.onkeyup = () => {
	const sanitizedValue = answerInput.value.replace(/[^0-9]/g, "")
	answerInput.value = sanitizedValue
}
