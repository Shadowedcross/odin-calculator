const DIVIDE_BY_ZERO_MESSAGES =[
    "I'm sorry User. I'm afraid I can't do that.",
    "To Infinity and Beyond!",
    "We don't do that around these parts.",
    "Divide by zero? Only in a parallel universe.",
]
let dividedByZero = false

let display;
let buttonsContainer;
let body

let currentOp = [null, null, null]
let opsArray = []
let opsIndex = 0
let lastType

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);

} else {
    initialize();
}

function initialize() {
    body = document.querySelector("body")
    body.addEventListener("keydown", parseInput)
    display = document.querySelector(".display-text")
    buttonsContainer = document.querySelector(".calculator-buttons");
    buttonsContainer.addEventListener("click", parseInput)
}

function parseInput(event) {
    let type
    let value;
    const target = event.target;
    if (event.type === "keydown") {
        let key = event.key
        if (isNumber(key)) {
            type = "operand"
            value = key;
        } else {
            switch(key) {
                case "Enter":
                case " ":
                    type = "calculate";
                    break;
                case "Backspace":
                    type = "delete";
                    break;
                case "Delete":
                    type = "clear";
                    break;
                case ".":
                    type = "decimal";
                    break;
                case "%":
                    type = "percent";
                    break;
                case "+":
                case "-":
                case "*":
                case "x":
                case "/":
                case "÷":
                    type = "operator";
                    if (key === "*") {
                        value = "x"
                    } else if (key === "/") {
                        value = "÷"
                    } else {
                        value = key;
                    }
                    break;
            }
        }
    } else if (target.type === "submit") {
        value = target.textContent;
        if (isNumber(value)) {
            type = "operand"
        } else {
            switch (value) {
                case "=":
                    type = "calculate";
                    break;
                case "DEL":
                    type = "delete";
                    break;
                case "C":
                    type = "clear";
                    break;
                case ".":
                    type = "decimal";
                    break;
                case "%":
                    type = "percent";
                    break;
                default:
                    type = "operator";
                    break;
            }
        }
    }
    if (type !== undefined) {
        if (dividedByZero) {
            display.style.textAlign = "end"
            dividedByZero = false
            clear();
        }
        switch (type) {
            case "operand":
                if (lastType === "calculate") {
                    clear()
                }
                addOperand(value);
                break;
            case "operator":
                if (currentOp[2] != null) {
                    calculate()
                }
                addOperator(value)
                break;
            case "decimal":
                if (opsArray[opsIndex] === undefined || (opsArray[opsIndex] !== undefined && !opsArray[opsIndex].includes(".")) || opsArray[opsIndex] !== undefined) {
                    if (currentOp[0] !== null && currentOp[1] !== null) {
                        addDecimal(2)
                    } else if (currentOp[0] === null) {
                        addDecimal(0)
                    } else {
                        addDecimal(0)
                    }
                }
                break;
            case "percent":
                if (currentOp[1]) {
                    percent()
                }
                break;
            case "delete":
                del();
                break;
            case "clear":
                clear();
                break;
            case "calculate":
                if (currentOp[1] !== null && currentOp[2] !== null) {
                    calculate();
                }
                break;
        }
        lastType = type;
    }
}

function percent() {
    let num1 = +currentOp[0]
    let operator = currentOp[1];
    let num2 = +currentOp[2]
    let num2AsPercent = num2 / 100;
    let num2PercentOfNum1 = getPercentOfNumber(num2AsPercent, num1)
    let result
    switch (operator) {
        case "x":
            result = num2PercentOfNum1
            break;
        case "+":
            result = num2PercentOfNum1 + num1;
            break;
        case "-":
            result = num1 - num2PercentOfNum1;
            break;
        case "÷":
            result = num2PercentOfNum1 * num1;
            break;
    }
    if (isInteger(result)) {
        result = Math.floor(result);
    } else {
        result.toFixed(2);
    }
    setAndClearCurrentOperation(result)
}

function getPercentOfNumber(percent, number) {
    return (percent * number)
}

function addOperand(value) {
    let indexValue = opsArray[opsIndex]
    opsArray[opsIndex] = isArrayIndexValue(opsArray, opsIndex, undefined) ? value : indexValue + value;
    if (isArrayIndexValue(currentOp, 1, null)){
        currentOp[0] = opsArray[opsIndex]
    } else {
        currentOp[2] = opsArray[opsIndex]
    }
    syncDisplay()
}

function addOperator(value) {
    opsArray.push(value)
    if (isArrayIndexValue(currentOp, 0, null)) {
        currentOp[0] = 0
    }
    opsIndex = opsArray.length - 1
    currentOp[1] = opsArray[opsIndex]
    opsIndex++
    syncDisplay()
}

function addDecimal(index) {
    currentOp[index] = currentOp[index] === null ? "0." : currentOp[index] += "."
    opsArray[opsIndex] = opsArray[opsIndex] === undefined ? "0." : opsArray[opsIndex] += "."
    syncDisplay()
}

function del() {
    setLastTypeValue(currentOp, "not-null")
    if (currentOp[0] === null) {
        clear();
    } else {
        syncDisplay();
    }
    opsArray.pop();
    opsIndex = opsArray.length - 1;
}

function clear() {
    setAndClearCurrentOperation(null)
    opsArray = []
    clearDisplay()
}

function calculate() {
    let num1 = +currentOp[0];
    let operator = currentOp[1];
    let num2 = +currentOp[2];
    let result
    switch (operator) {
        case "+":
            result = add(num1, num2);
            break;
        case "-":
            result = subtract(num1, num2);
            break;
        case "÷":
            if (num2 === 0) {
                result = null
                break;
            }
            result = divide(num1, num2)
            break;
        case "x":
            result = multiply(num1, num2);
            break;
    }
    console.log(result)
    if (result !== null) {
        if (isInteger(result)) {
            result = Math.floor(result);
        }
        setAndClearCurrentOperation(result)
    } else {
        dividedByZero = true;
        displayDivisionError()
    }

}

function displayDivisionError() {
    clear()
    display.textContent = pickRandomDivideByZeroMsg()
    display.style.textAlign = "start"
}

function add(num1, num2) {
    return (num1 + num2).toFixed(2);
}

function subtract(num1, num2) {
    return (num1 - num2).toFixed(2);
}

function divide(num1, num2) {
    return (num1 / num2).toFixed(2);
}

function multiply(num1, num2) {
    return (num1 * num2).toFixed(2);
}

function isNumber(char) {
    return !isNaN(parseInt(char));
}

function syncDisplay() {
    display.textContent = currentOp.join(" ");
}

function clearDisplay() {
    display.textContent = 0;
}

function setLastTypeValue(array, type, value = null) {
    array[findLastTypeValue(array, type)] = value
}

function findLastTypeValue(array, type) {
    if (type === "not-null") {
        for (let i = array.length - 1; i < array.length; i--) {
            if (array[i] !== null) {
                return i
            }
        }
    } else if (type === "number") {
        for (let i = array.length - 1; i < array.length; i--) {
            if (isNumber(array[i])) {
                return i
            }
        }
    }

}

function isInteger(value) {
    return Number.isInteger(+value)
}

function setAndClearCurrentOperation(value) {
    currentOp[0] = value;
    currentOp[1] = null;
    currentOp[2] = null;
    syncDisplay()
}

function pickRandomDivideByZeroMsg() {
    return DIVIDE_BY_ZERO_MESSAGES[getRandomInt(0, DIVIDE_BY_ZERO_MESSAGES.length)]
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function isArrayIndexValue(array, index, value) {
    return array[index] === value;
}
















