const inputField = document.getElementById('inputField');
const unitBox = document.getElementById('unitBox');
const convertBtn = document.getElementById('convertBtn');
const resultLabel = document.getElementById('resultLabel');
const promptLabel = document.getElementById('prompt');
const body = document.body;

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

const Convert = {
    fToC: (f) => Math.round((f - 32) * (5/9)),
    cToF: (c) => Math.round((c * (9/5)) + 32),
    cToK: (c) => Math.round(c + 273.15),
    kToC: (k) => Math.round(k - 273.15),
    fToK: (f) => Convert.cToK(Convert.fToC(f)),
    kToF: (k) => Convert.cToF(Convert.kToC(k)),
    fToR: (f) => Math.round(f + 459.67),
    rToF: (r) => Math.round(r - 459.67),
    rToC: (r) => Convert.fToC(Convert.rToF(r)),
    rToK: (r) => Convert.fToK(Convert.rToF(r))
};

function getStatus(f) {
    if (f <= -459) return "Zero";
    if (f <= -238) return "Cryogenic";
    if (f <= -58) return "Polar";
    if (f <= 0) return "Bitter";
    if (f <= 32) return "Frigid";
    if (f < 50) return "Cold";
    if (f < 60) return "Chilly";
    if (f <= 77) return "Ideal";
    if (f <= 95) return "Warm";
    if (f <= 122) return "Hot";
    if (f <= 212) return "Scorched";
    if (f <= 500) return "Inferno";
    return "Hellsurge";
}

const colors = {
    "Zero": "#000000", 
    "Cryogenic": "#32174d",
    "Polar": "#4b0082", 
    "Bitter": "#8601af",
    "Frigid": "#8601af", 
    "Cold": "#0000FF",
    "Chilly": "#00FF00", 
    "Ideal": "#FFFF00", 
    "Warm": "#FFA500", 
    "Hot": "#FF0000",
    "Scorched": "#ff66cc", 
    "Inferno": "#800000",
    "Hellsurge": "#22150C"
};

convertBtn.addEventListener('click', () => {
    let raw = inputField.value.replace(/,/g, '');
    if (raw === "" || raw === "-") return;

    let val = parseInt(raw);
    let unit = unitBox.value;

    if ((unit === "Kelvin" || unit === "Rankine") && val < 0) val = 0;
    else if (unit === "Celsius" && val < -273) val = -273;
    else if (unit === "Fahrenheit" && val < -460) val = -460;

    inputField.value = new Intl.NumberFormat('en-US').format(val);

    let f, c, k, r;
    switch (unit) {
        case "Fahrenheit": f = val; break;
        case "Celsius": f = Convert.cToF(val); break;
        case "Kelvin": f = Convert.kToF(val); break;
        case "Rankine": f = Convert.rToF(val); break;
    }

    f = f + 0;
    c = Convert.fToC(f) + 0;
    k = Convert.fToK(f) + 0;
    r = Convert.fToR(f) + 0;

    const status = getStatus(f);
    body.style.backgroundColor = colors[status];

    const isDark = ["Hot", "Frigid", "Cold", "Inferno", "Bitter", "Zero", "Polar", "Cryogenic", "Hellsurge"].includes(status);
    const textCol = isDark ? "white" : "black";
    resultLabel.style.color = textCol;
    promptLabel.style.color = textCol;

    const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

    resultLabel.innerText = 
        `U.S. System: ${fmt(f)} °F\n` +
        `Metric System: ${fmt(c)} °C\n` +
        `Science: ${fmt(k)} K\n` +
        `Specialized Eng: ${fmt(r)} °R\n\n` +
        `Status: ${status}`;
});