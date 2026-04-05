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

| Status | Fahrenheit Range |
|---|---|
| Zero | ≤ −459 °F |
| Cryogenic | −458 to −238 °F |
| Polar | −237 to −58 °F |
| Bitter | −57 to 0 °F |
| Frigid | 1 to 32 °F |
| Cold | 33 to 49 °F |
| Chilly | 50 to 59 °F |
| Ideal | 60 to 77 °F |
| Warm | 78 to 95 °F |
| Hot | 96 to 122 °F |
| Scorched | 123 to 212 °F |
| Inferno | 213 to 500 °F |
| Hellsurge | > 500 °F |

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
