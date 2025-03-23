const leftCol = document.getElementById("left-col")
const rightCol = document.getElementById("right-col")
const answerInput = document.getElementById("answer")
const settings = document.querySelectorAll(
	"body > section:first-of-type ul li input"
)
const difficultyLevels = ["easy", "medium", "hard"]
const operators = {
	add: "+",
	sub: "-",
	mult: "*",
	div: "/",
	factor: "^",
	brack: "()",
}
let score = 0

// ORDER OF OPERATIONS
// ()
// ^2
// /
// *
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
	let includeBrack = false
	setTypes.forEach((type) => {
		if (type == "brack") {
			includeBrack = true
		} else if (type in operators) {
			setOperators.push(operators[type])
		}
	})
	console.log(includeBrack)
	console.log(setOperators)

	let placedX = false
	let lastNumber = false
	let lastOperator = false
	let lastBrack = false

	if (!placedX) {
		insertX(leftCol)
		placedX = true
	}

	switch (setDifficulty) {
		case "easy":
			lastNumber = insertNumber(rightCol, lastNumber, lastOperator)
			lastOperator = insertOperator(rightCol, setOperators)
			if (lastOperator !== "^") {
				lastNumber = insertNumber(rightCol, lastNumber, lastOperator)
			}
			break

		case "medium":
			const iterations = Math.floor(Math.random() * 3 + 1)

			lastNumber = insertNumber(rightCol, lastNumber, lastOperator)
			for (let i = 1; i <= iterations; i++) {
				if (Math.random() < iterations / 5) {
					console.log("adding brackets")
					lastBrack = insertBracket(rightCol, lastBrack)
					insertIteration(rightCol, setOperators, lastNumber, lastOperator)
					lastBrack = insertBracket(rightCol, lastBrack)
				} else {
					insertIteration(rightCol, setOperators, lastNumber, lastOperator)
				}
			}
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

const insertOperator = (column, op, lastOperator) => {
	let operator = op[Math.floor(Math.random() * op.length)]
	if (op.length > 1) {
		while (operator === "^" && lastOperator === "^") {
			operator = op[Math.floor(Math.random() * op.length)]
		}
	}

	console.log(operator)
	if (operator == "^") {
		const span = document.createElement("span")
		const factor = document.createElement("sup")
		factor.innerHTML = Math.floor(Math.random() * 3 + 1)
		column.appendChild(span)
		span.appendChild(factor)
		// lastOperator = operator

		// if (op.length > 1) {
		// 	insertOperator(column, op, lastNumber, lastOperator)
		// }
	} else {
		const span = document.createElement("span")
		span.innerHTML = operator
		column.appendChild(span)
	}
	return operator
}

const insertBracket = (column, lastBrack) => {
	const span = document.createElement("span")
	if (!lastBrack) {
		span.innerHTML = "("
		lastBrack = true
	} else {
		span.innerHTML = ")"
		lastBrack = false
	}
	column.appendChild(span)

	return lastBrack
}

const insertIteration = (column, op, lastNumber, lastOperator) => {
	lastOperator = insertOperator(column, op, lastOperator)
	if (lastOperator !== "^") {
		lastNumber = insertNumber(column, lastNumber, lastOperator)
	} else if (op.length > 1) {
		lastOperator = insertOperator(column, op, lastOperator)
		lastNumber = insertNumber(column, lastNumber, lastOperator)
	}
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

const resetPuzzle = (fullReset) => {
	console.log("Resetting puzzle")

	if (fullReset) {
		score = 0
		document.getElementById("score").innerHTML = score
	}

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
		if (span.querySelector("sup") !== null) {
			components.push("**" + span.querySelector("sup").textContent)
		} else {
			components.push(span.textContent)
		}
	})
	const calc = components.join("")
	console.log(calc)
	console.log(eval(calc))

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
		score++
		document.getElementById("score").innerHTML = score
		answerInput.value = ""
		resetPuzzle(false)
		initPuzzle()
	} else {
		console.log("False")
		score = 0
		document.getElementById("score").innerHTML = score
		answerInput.value = ""
	}
}

document.getElementById("reset").onclick = () => {
	resetPuzzle(true)

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
	const sanitizedValue = answerInput.value.replace(/(?!^-)[^0-9]/g, "")
	answerInput.value = sanitizedValue
}
