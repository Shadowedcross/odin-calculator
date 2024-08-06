const DIVIDE_BY_ZERO_MSG = "To infinity and beyond!"

let dividedByZero = false;
let pastFirstOperator = false
let num1 = 0
let operationIndex = 0;
let operationsArray = [];
let displayValue = ""

let display;
let buttonsContainer;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);

} else {
    initialize();
}

function initialize() {
    display = document.querySelector(".display")
    buttonsContainer = document.querySelector(".calculator-buttons");
    buttonsContainer.addEventListener("click", parseInput)
}

function parseInput(event) {
    const target = event.target;
    const value = target.textContent;
    if (dividedByZero || value === "clr") {
        clear()
    } else if (value === "=") {
        if (operationsArray.length !== 0) {
            calculate()
        }
    } else {
        const type = Number.isInteger(+value) ? "operand" : "operator";
        if (type === "operator") {
            if (pastFirstOperator) {
                calculate()
            } else {
                pastFirstOperator = true
            }
        }
        updateOperationsArray(value, type)
        addToDisplay(type === "operand" ? `${value}` : ` ${value} `)
    }
}

function isInteger(value) {
    return Number.isInteger(+value)
}

function updateOperationsArray(value, type) {
    let indexValue = operationsArray[operationIndex]
    if (indexValue === undefined) {
        operationsArray.push(0)
        indexValue = operationsArray[operationIndex]
    }
    const valueToPush = (type === "operand") ? +(indexValue + value) : value;
    if (type === "operand") {
        addOrEditOperand(valueToPush)
    } else {
        addOperator(value)

    }
}

function addOperator(value) {
    operationIndex++
    operationsArray.push(value)
    operationIndex++
}

function addOrEditOperand(value) {
    operationsArray[operationIndex] = value;
}

function addToDisplay(value) {
    displayValue = displayValue === "0" ? value : displayValue += value
    display.textContent = displayValue;
}

function setDisplay(value) {
    displayValue = value;
    display.textContent = displayValue
}

function calculate() {
    let operator = ""
    let num2 = null
    if (operationsArray.length > 0) {
        setDisplay(operationsArray.reduce((sum, value) => {
            if (isInteger(+value)) {
                num2 = value;
            } else {
                operator = value;
            }
            if (isValidOperation(sum, operator, num2)) {
                let result = operate(sum, operator, num2);
                if (result === DIVIDE_BY_ZERO_MSG) {
                    dividedByZero = true;
                    return result;
                } else {
                    if (isInteger(result)) {
                        sum = Math.floor(result);
                    } else {
                        sum = result.toFixed(2)
                    }
                    num1 = sum;
                    operator = "";
                    num2 = null;
                }
            }
            return sum;
        }))
    }
}

function operate(num1, operator, num2) {
    switch (operator) {
        case '+':
            return add(num1, num2).toFixed(2);
        case '-':
            return subtract(num1, num2).toFixed(2);
        case 'x':
            return multiply(num1, num2).toFixed(2);
        case '÷':
            if (num2 === 0) {
                return "To infinity and beyond!"
            }
            return divide(num1, num2).toFixed(2);
    }
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function isValidOperation(num1, operator, num2) {
    return (num1 !== null && operator !== "" && num2 != null)
}

function clear() {
    num1 = 0
    operationsArray = [];
    operationIndex = 0;
    dividedByZero = false
    setDisplay("0")
}
















