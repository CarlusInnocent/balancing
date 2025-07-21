// This file contains the JavaScript code for the static site. It handles calculations for balancing money, form submissions, and user interactions.

document.addEventListener('DOMContentLoaded', function() {
    // Input elements
    const grandTotalInput = document.getElementById('grand-total');
    const accountInputs = [
        document.getElementById('airtel1'),
        document.getElementById('airtel2'),
        document.getElementById('mtn'),
        document.getElementById('standbic'),
        document.getElementById('equity'),
        document.getElementById('dfcu'),
        document.getElementById('centenary')
    ];
    const otherInputs = [
        document.getElementById('savings'),
        document.getElementById('senga')
    ];
    const negativesInput = document.getElementById('negatives');
    const negativesForm = document.getElementById('negatives-form');
    const negativeAmountInput = document.getElementById('negative-amount');
    const negativesList = document.getElementById('negatives-list');
    const cashDisplay = document.getElementById('cash');
    const balanceDisplay = document.getElementById('balance');

    // Formatted value spans
    const formattedSpans = {
        'grand-total': document.getElementById('grand-total-formatted'),
        'airtel1': document.getElementById('airtel1-formatted'),
        'airtel2': document.getElementById('airtel2-formatted'),
        'mtn': document.getElementById('mtn-formatted'),
        'standbic': document.getElementById('standbic-formatted'),
        'equity': document.getElementById('equity-formatted'),
        'dfcu': document.getElementById('dfcu-formatted'),
        'centenary': document.getElementById('centenary-formatted'),
        'savings': document.getElementById('savings-formatted'),
        'senga': document.getElementById('senga-formatted'),
        'negatives': document.getElementById('negatives-formatted')
    };

    let negativesArray = [];

    // Add for options
    const optionsInput = document.getElementById('options');
    const optionsForm = document.getElementById('options-form');
    const optionAmountInput = document.getElementById('option-amount');
    const optionsList = document.getElementById('options-list');

    let optionsArray = [];

    // Update calculation on input change
    // Add listeners for options
    function addListeners() {
        [grandTotalInput, negativesInput, optionsInput, ...accountInputs, ...otherInputs].forEach(input => {
            input.addEventListener('input', () => {
                updateFormattedInputs();
                updateCalculations();
            });
        });
    }

    negativesForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const value = parseFloat(negativeAmountInput.value);
        if (!isNaN(value)) {
            negativesArray.push(value);
            renderNegatives();
            updateCalculations();
            negativeAmountInput.value = '';
        }
    });

    optionsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const value = parseFloat(optionAmountInput.value);
        if (!isNaN(value)) {
            optionsArray.push(value);
            renderOptions();
            updateCalculations();
            optionAmountInput.value = '';
        }
    });

    function renderNegatives() {
        negativesList.innerHTML = '';
        negativesArray.forEach((val, idx) => {
            const li = document.createElement('li');
            li.textContent = formatNumber(val);
            // Optionally add remove button
            const btn = document.createElement('button');
            btn.textContent = 'Remove';
            btn.onclick = function() {
                negativesArray.splice(idx, 1);
                renderNegatives();
                updateCalculations();
            };
            li.appendChild(btn);
            negativesList.appendChild(li);
        });
    }

    function renderOptions() {
        optionsList.innerHTML = '';
        optionsArray.forEach((val, idx) => {
            const li = document.createElement('li');
            li.textContent = formatNumber(val);
            const btn = document.createElement('button');
            btn.textContent = 'Remove';
            btn.onclick = function() {
                optionsArray.splice(idx, 1);
                renderOptions();
                updateCalculations();
            };
            li.appendChild(btn);
            optionsList.appendChild(li);
        });
    }

    function sumInputs(inputs) {
        return inputs.reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    }

    function sumNegatives() {
        return (parseFloat(negativesInput.value) || 0) + negativesArray.reduce((a, b) => a + b, 0);
    }

    function sumOptions() {
        return (parseFloat(optionsInput.value) || 0) + optionsArray.reduce((a, b) => a + b, 0);
    }

    function formatNumber(num) {
        return num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    }

    function updateFormattedInputs() {
        Object.entries(formattedSpans).forEach(([key, span]) => {
            let input = document.getElementById(key);
            if (input && span) {
                span.textContent = formatNumber(parseFloat(input.value) || 0);
            }
        });
    }

    function updateCalculations() {
        const GT = parseFloat(grandTotalInput.value) || 0;
        const A = sumInputs(accountInputs);
        const O = sumInputs(otherInputs);
        const N = sumNegatives();
        const Opt = sumOptions();

        const cash = GT - A + O - N;
        const balance = cash - Opt;

        const formattedCash = `<strong>${formatNumber(cash)}</strong>`;
        const formattedBalance = `<strong>${formatNumber(balance)}</strong>`;
        cashDisplay.innerHTML = formattedCash;
        balanceDisplay.innerHTML = formattedBalance;
    }

    addListeners();
    updateFormattedInputs();
    updateCalculations();
});