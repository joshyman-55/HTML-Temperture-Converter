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
const body = document.body;
let lastStatus = null;

const abbr = { Fahrenheit: "°F", Celsius: "°C", Kelvin: "K", Rankine: "°R" };

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

inputField.addEventListener('input', function(e) {
    let cursor = e.target.selectionStart;
    let val = e.target.value;

    if (val.includes('+') || val.indexOf('-', 1) > 0) {
        val = val.replace(/\+/g, '').replace(/(?!^)-/g, '');
    }

    if (val === "-0") val = "-";

    let digits = val.replace(/,/g, '');

    if ((digits.startsWith('0') && digits.length > 1) || (digits.startsWith('-0') && digits.length > 2)) {
        digits = digits.startsWith('-') ? "-" + digits.slice(2) : digits.slice(1);
    }

    if (digits === "" || digits === "-") {
        e.target.value = digits;
        return;
    }

    if (/^-?\d*$/.test(digits)) {
        const formatted = new Intl.NumberFormat('en-US').format(parseInt(digits));
        const commasBefore = (val.substring(0, cursor).match(/,/g) || []).length;
        e.target.value = formatted;
        const commasAfter = (formatted.substring(0, cursor).match(/,/g) || []).length;
        const offset = commasAfter - commasBefore;
        e.target.setSelectionRange(cursor + offset, cursor + offset);
    } else {
        e.target.value = val.replace(/[^\d,-]/g, '');
    }
});

function roundClean(n) {
    const r = Math.round(n);
    return r === 0 ? 0 : r;
}

const Convert = {
    fToC: (f) => roundClean((f - 32) * (5/9)),
    cToF: (c) => roundClean((c * (9/5)) + 32),
    cToK: (c) => roundClean(c + 273.15),
    kToC: (k) => roundClean(k - 273.15),
    fToK: (f) => Convert.cToK(Convert.fToC(f)),
    kToF: (k) => Convert.cToF(Convert.kToC(k)),
    fToR: (f) => roundClean(f + 459.67),
    rToF: (r) => roundClean(r - 459.67)
};

function toFahrenheit(value, unit) {
    switch (unit) {
        case "Fahrenheit": return value;
        case "Celsius": return Convert.cToF(value);
        case "Kelvin": return Convert.kToF(value);
        case "Rankine": return Convert.rToF(value);
    }
}

function fromFahrenheit(f, unit) {
    switch (unit) {
        case "Fahrenheit": return f;
        case "Celsius": return Convert.fToC(f);
        case "Kelvin": return Convert.fToK(f);
        case "Rankine": return Convert.fToR(f);
    }
}

function getStatus(f) {
    if (f <= -459) return "Zero";
    if (f <= -238) return "Cryogenic";
    if (f <= -85) return "Glacial";
    if (f <= -4) return "Bitter";
    if (f <= 32) return "Frigid";
    if (f < 50) return "Cold";
    if (f < 60) return "Chilly";
    if (f <= 77) return "Warm";
    if (f <= 95) return "Hot";
    if (f <= 122) return "Sweltering";
    if (f <= 212) return "Blistering";
    if (f <= 500) return "Superheated";
    if (f <= 932) return "Blazing";
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

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = colors[status];
}

convertBtn.addEventListener('click', () => {
    let raw = inputField.value.replace(/,/g, '');
    if (raw === "" || raw === "-") return;

    let val = parseInt(raw);
    let fUnit = fromUnit.value;
    let tUnit = toUnit.value;

    if ((fUnit === "Kelvin" || fUnit === "Rankine") && val < 0) val = 0;
    else if (fUnit === "Celsius" && val < -273) val = -273;
    else if (fUnit === "Fahrenheit" && val < -459) val = -459;

    inputField.value = new Intl.NumberFormat('en-US').format(val);

    const f = toFahrenheit(val, fUnit);
    const result = fromFahrenheit(f, tUnit);

    outputField.value = new Intl.NumberFormat('en-US').format(result);

    const status = getStatus(f);
    lastStatus = status;
    applyColors(status);

    resultLabel.innerText = `Status: ${status}`;
});