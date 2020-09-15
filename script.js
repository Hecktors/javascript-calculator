// Creating Nodes
const display = document.getElementById('display');
const buttons = document.getElementsByClassName('btn');

// Event listener
for (let i = 0; i < buttons.length; i++) {
	buttons[i].addEventListener('click', function() {
		this.id === 'clear' && calculator.clearInput();
		this.id === 'clearEntry' && calculator.deleteLast();
		this.id === 'invert' && calculator.invert();
		this.id === 'equals' && calculator.getResult();
		/[\d+\-x\/.]{1}/.test(this.value) && calculator.addToInput(this.value);
	});
}

// Main object
const calculator = {
	inputStr: '0',
	clearInput() {
		this.inputStr = '0';
		this.displayInputStr();
	},
	addToInput(val) {
		this.inputStr = getModifiedInputStr(this.inputStr, val);
		this.displayInputStr();
	},
	deleteLast() {
		this.inputStr = this.inputStr.slice(0, this.inputStr.length - 1);
		this.displayInputStr();
	},
	invert() {
		if (/^\-?\d+$/.test(this.inputStr)) {
			this.inputStr = -this.inputStr;
			this.displayInputStr();
		}
	},
	getResult() {
		this.inputStr = String(calculate(this.inputStr));
		this.displayInputStr();
	},
	displayInputStr() {
		display.innerHTML = this.inputStr;
	}
};

function getModifiedInputStr(str, val) {
	// Replace default value (0) with first input
	if (str === '0' && /\d/.test(val)) {
		return val;
	}
	// Prevent double usage of period in number
	if (/.*\.$|.*\d*\.\d*$/.test(str) && val === '.') {
		return str;
	}
	// Case both end of string and new input contain operators
	if (/.*[+\-x\/]$/.test(str) && /[+\-x\/]/.test(val)) {
		// If string end with 'x' or '/' append substract operator
		if (/.*[x\/]$/.test(str) && val === '-') {
			return str + val;
		}
		// If string ends with '%-' or 'x-' replace with new operator
		if (/.*[x\/]-/.test(str) && /[+x\/]/.test(val)) {
			return str.slice(0, str.length - 2) + val;
		}
		// Replace operator in end of string with new operator
		return str.slice(0, str.length - 1) + val;
	}
	return str + val;
}

function calculate(str) {
	// Remove operators appending string
	while (/.*[+¸\-x\/]$/.test(str)) {
		str = str.slice(0, str.length - 1);
	}
	str = str.replaceAll('x', '*');
	// Return as calculation
	return new Function('return ' + str)();
}
