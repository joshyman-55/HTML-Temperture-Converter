# HTML Temperture Converter

A simple web app that converts temperatures across all four major scales with a UI that visually reacts to how hot or cold the value is.

## Features

- Converts between Fahrenheit, Celsius, Kelvin, and Rankine
- Background color shifts dynamically based on the temperature range
- Human-readable status label (e.g. *Frigid*, *Ideal*, *Inferno*) shown with each result
- Input is formatted with commas as you type
- Out-of-range values are automatically clamped to physical minimums
- No frameworks or build tools — plain HTML, CSS, and JavaScript

## Temperature Statuses

| Classification | Temperature Range (°F / °C) | Color | Meaning |
|--------------|-----------------------------|------|--------|
| Zero | -460 to -459°F / -273°C | ⚫ Black | Absolute zero |
| Cryogenic | -458 to -238°F / -272 to -150°C | 🟣 Deep Purple | Extremely cold |
| Glacial | -238 to -85°F / -150 to -65°C | 🟪 Indigo | Harsh frozen |
| Bitter | -84 to -4°F / -64 to -20°C | 🟣 Purple | Severe cold |
| Frigid | -3 to 32°F / -19 to 0°C | 🟣 Purple | Freezing conditions |
| Cold | 33 to 49°F / 1 to 9°C | 🔵 Blue | Cold weather |
| Chilly | 50 to 59°F / 10 to 15°C | 🟢 Green | Cool and mild |
| Ideal | 60 to 77°F / 16 to 25°C | 🟡 Yellow | Comfortable temperature |
| Warm | 78 to 95°F / 26 to 35°C | 🟠 Orange | Warm conditions |
| Hot | 96 to 122°F / 36 to 50°C | 🔴 Red | High heat |
| Scorched | 123 to 212°F / 51 to 100°C | 🔴 Red | Extreme heat |
| Convection | 213 to 500°F / 101 to 260°C | 🧱 Maroon | Dangerous heat |
| Blazing | 501 to 932°F / 261 to 500°C | 🧱 Dark Red | Brutal heat |
| Inferno | ≥ 933°F  / ≥ 501°C | ⚫️ Near Black | Cremation |

## Usage

Open `index.html` in any modern browser — no installation or server required.

1. Type a temperature into the input field
2. Select the source unit from the dropdown
3. Click **Convert**
4. All four equivalents display along with the status and a matching background color

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure |
| `style.css` | Layout and styling |
| `script.js` | Conversion logic, input formatting, and theming |

## License

MIT
