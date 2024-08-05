if (document.readyState === "loading" ) {
    document.addEventListener("DOMContentLoaded", initialize);

} else {
    initialize();
}

function initialize() {
    display = document.querySelector(".display")
    buttonsContainer = document.querySelector(".calculator-buttons");
    buttonsContainer.addEventListener("click", parseInput)
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

function operate(num1, operator, num2) {
    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case 'x':
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
        }
}

let displayValue = ""
let display;
let buttonsContainer;

function updateDisplay(value){
    displayValue += value;
    display.textContent = displayValue;
}

function parseInput(event) {
    const target = event.target;
    const targetContent = target.textContent;
    updateDisplay(targetContent)
}

