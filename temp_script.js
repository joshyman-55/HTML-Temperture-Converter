const inputField = document.getElementById('inputField');
const outputField = document.getElementById('outputField');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const fromAbbr = document.getElementById('fromAbbr');
const toAbbr = document.getElementById('toAbbr');
const convertBtn = document.getElementById('convertBtn');
const resultLabel = document.getElementById('resultLabel');
const promptLabel = document.getElementById('prompt');
const resultPromptLabel = document.getElementById('resultPrompt');
const decimalSelect = document.getElementById('decimalSelect');
const decimalPromptLabel = document.getElementById('decimalPrompt');
const body = document.body;
let lastStatus = null;

const abbr = { Fahrenheit: "°F", Celsius: "°C", Kelvin: "K", Rankine: "°Ra" };

function updateAbbrs() {
    fromAbbr.textContent = abbr[fromUnit.value];
    toAbbr.textContent = abbr[toUnit.value];
}

fromUnit.dataset.prevValue = fromUnit.value;
toUnit.dataset.prevValue = toUnit.value;
updateAbbrs();

fromUnit.addEventListener('change', function () {
    if (fromUnit.value === toUnit.value) {
        const previousFromValue = fromUnit.dataset.prevValue;
        toUnit.value = previousFromValue;
        toUnit.dataset.prevValue = previousFromValue;
    }
    fromUnit.dataset.prevValue = fromUnit.value;
    updateAbbrs();
});

toUnit.addEventListener('change', function () {
    if (toUnit.value === fromUnit.value) {
        const previousToValue = toUnit.dataset.prevValue;
        fromUnit.value = previousToValue;
        fromUnit.dataset.prevValue = previousToValue;
    }
    toUnit.dataset.prevValue = toUnit.value;
    updateAbbrs();
});

function getDecimals() {
    return parseInt(decimalSelect.value, 10);
}

// Cleans raw text: optional leading minus, digits with thousands commas,
// and (when allowed) one decimal point with up to `decimals` digits after it.
function formatNumberText(raw, decimals) {
    const neg = raw.trim().startsWith('-');
    const cleaned = raw.replace(/[^\d.]/g, '');
    const dot = cleaned.indexOf('.');
    let intPart = dot === -1 ? cleaned : cleaned.slice(0, dot);
    let decPart = null;
    if (dot !== -1 && decimals > 0) {
        decPart = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, decimals);
    }
    intPart = intPart.replace(/^0+(?=\d)/, '');
    if (intPart === '' && decPart === null) return neg ? '-' : '';
    if (intPart === '') intPart = '0';
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (neg ? '-' : '') + withCommas + (decPart !== null ? '.' + decPart : '');
}

function reformatInput() {
    const decimals = getDecimals();
    const val = inputField.value;
    const cursor = inputField.selectionStart ?? val.length;
    const formatted = formatNumberText(val, decimals);
    const sig = formatNumberText(val.substring(0, cursor), decimals).replace(/,/g, '').length;
    let pos = 0, count = 0;
    while (pos < formatted.length && count < sig) {
        if (formatted[pos] !== ',') count++;
        pos++;
    }
    inputField.value = formatted;
    if (document.activeElement === inputField) inputField.setSelectionRange(pos, pos);
}

inputField.addEventListener('input', reformatInput);

decimalSelect.addEventListener('change', function () {
    reformatInput();
    if (lastStatus && outputField.value !== '') convertBtn.click();
});

function roundTo(n, decimals) {
    const p = Math.pow(10, decimals);
    const scaled = parseFloat((Math.abs(n) * p).toPrecision(12));
    const r = Math.sign(n) * Math.round(scaled) / p;
    return r === 0 ? 0 : r; // eliminates -0
}

function toFahrenheit(value, unit) {
    switch (unit) {
        case "Fahrenheit": return value;
        case "Celsius": return value * 9 / 5 + 32;
        case "Kelvin": return (value - 273.15) * 9 / 5 + 32;
        case "Rankine": return value - 459.67;
    }
}

function fromFahrenheit(f, unit) {
    switch (unit) {
        case "Fahrenheit": return f;
        case "Celsius": return (f - 32) * 5 / 9;
        case "Kelvin": return (f - 32) * 5 / 9 + 273.15;
        case "Rankine": return f + 459.67;
    }
}

// Status/colors always use the whole-number sibling of the input, so 32.3 F
// gets the same color as 32 F, exactly like the original integer-only version.
function roundInt(n) {
    const r = Math.sign(n) * Math.round(parseFloat(Math.abs(n).toPrecision(12)));
    return r === 0 ? 0 : r;
}

const IntConvert = {
    fToC: (f) => roundInt((f - 32) * (5/9)),
    cToF: (c) => roundInt((c * (9/5)) + 32),
    kToC: (k) => roundInt(k - 273.15),
    rToF: (r) => roundInt(r - 459.67)
};

function statusFahrenheit(wholeValue, unit) {
    switch (unit) {
        case "Fahrenheit": return wholeValue;
        case "Celsius": return IntConvert.cToF(wholeValue);
        case "Kelvin": return IntConvert.cToF(IntConvert.kToC(wholeValue));
        case "Rankine": return IntConvert.rToF(wholeValue);
    }
}

function getStatus(f) {
    if (f <= -459) return "Zero";
    if (f <= -238) return "Cryogenic";
    if (f <= -85) return "Glacial";
    if (f <= -1) return "Bitter";
    if (f <= 32) return "Frigid";
    if (f < 50) return "Cold";
    if (f < 60) return "Chilly";
    if (f <= 77) return "Warm";
    if (f <= 95) return "Hot";
    if (f <= 122) return "Sweltering";
    if (f < 212) return "Blistering";
    if (f < 500) return "Superheated";
    if (f < 932) return "Blazing";
    return "Inferno";
}

const colors = {
    "Zero": "#000000",
    "Cryogenic": "#32174d",
    "Glacial": "#4b0082",
    "Bitter": "#8601af",
    "Frigid": "#8601af",
    "Cold": "#0000FF",
    "Chilly": "#00FF00",
    "Warm": "#FFFF00",
    "Hot": "#FFA500",
    "Sweltering": "#FF0000",
    "Blistering": "#FF0000",
    "Superheated": "#800000",
    "Blazing": "#580000",
    "Inferno": "#1f2020"
};

function applyColors(status) {
    body.style.backgroundColor = colors[status];
    const isDark = ["Sweltering", "Blistering", "Frigid", "Cold", "Inferno", "Bitter", "Zero", "Glacial", "Cryogenic", "Blazing", "Superheated"].includes(status);
    const textCol = isDark ? "white" : "black";
    resultLabel.style.color = textCol;
    promptLabel.style.color = textCol;
    resultPromptLabel.style.color = textCol;
    decimalPromptLabel.style.color = textCol;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = colors[status];
}

convertBtn.addEventListener('click', () => {
    const decimals = getDecimals();
    const p = Math.pow(10, decimals);
    const raw = inputField.value.replace(/,/g, '');
    let val = parseFloat(raw);
    if (isNaN(val)) return;
    if (val === 0) val = 0; // eliminates -0

    const fUnit = fromUnit.value;
    const tUnit = toUnit.value;

    // Clamp to absolute zero (rounded up to the chosen precision)
    const minFor = (min) => Math.ceil(min * p - 1e-9) / p;
    if ((fUnit === "Kelvin" || fUnit === "Rankine") && val < 0) val = 0;
    else if (fUnit === "Celsius" && val < minFor(-273.15)) val = minFor(-273.15);
    else if (fUnit === "Fahrenheit" && val < minFor(-459.67)) val = minFor(-459.67);

    inputField.value = new Intl.NumberFormat('en-US', { maximumFractionDigits: decimals }).format(val);

    const f = toFahrenheit(val, fUnit);
    const result = roundTo(fromFahrenheit(f, tUnit), decimals);

    outputField.value = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(result);

    // Color/status comes from the rounded whole-number sibling of the input
    let whole = roundInt(val);
    if ((fUnit === "Kelvin" || fUnit === "Rankine") && whole < 0) whole = 0;
    else if (fUnit === "Celsius" && whole < -273) whole = -273;
    else if (fUnit === "Fahrenheit" && whole < -459) whole = -459;
    const status = getStatus(statusFahrenheit(whole, fUnit));
    lastStatus = status;
    applyColors(status);

    resultLabel.innerText = `Status: ${status}`;
});