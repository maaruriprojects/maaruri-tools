# Phase 2 — Tools Implementation

Implement tools one at a time. Each tool gets its own branch, commit, and
prompt. Do not start Phase 2 until Phase 1 is complete and verified.

Each tool prompt below is a standalone copy-paste block. The AI coding tool
should review the existing code before each prompt.

---

## Prompt 7 — BMI Calculator

**Branch:** `phase2/01-bmi-calculator`
**Commit:** `feat: implement BMI Calculator tool`

```
Review these files before making changes:
- client/src/app/features/tools/tool-shell/tool-shell.ts
- client/src/app/features/tools/tool-shell/tool-page-contract.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/features/tools/tool-registry.ts
- client/src/app/shared/models/tool-meta.ts
- client/src/app/shared/components/text-input/text-input.ts
- client/src/app/shared/components/select-control/select-control.ts
- client/src/app/shared/components/button/button.ts
- client/src/app/shared/components/copy-button/copy-button.ts
- client/src/assets/data/tool-registry.json
- client/src/assets/data/search-index.json
- docs/design/04-page-layout-system.md (Template A)
- docs/design/06-component-visual-design.md (Readout, inputs)
- docs/design/08-animation-motion.md (Readout pulse)

Implement the BMI Calculator tool.

Create:
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.ts
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.html
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.scss
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.spec.ts
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.util.ts
- client/src/app/features/tools/health-fitness/bmi-calculator/bmi-calculator.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (ensure bmi-calculator entry exists)
- client/src/assets/data/search-index.json (ensure bmi-calculator entry exists)
- client/src/app/features/tools/tool-registry.ts (ensure slug is listed)
- ToolShell's component-key-to-lazy-import map (add BmiCalculator)

Functional requirements:
- Inputs: height and weight
- Unit toggle: metric (cm, kg) and imperial (ft+in, lb)
- Appropriate inputmode: decimal for numeric fields
- Validation:
  - Height and weight are required
  - Must be positive numbers
  - Reasonable range checks (height 50-300cm, weight 20-500kg)
  - Validate on blur or submit, never on every keystroke (doc 09 §4)
- Reset button: clears all inputs and the result
- Result displayed in the Readout area (BMI value to 1 decimal place)
- BMI category shown below the value:
  - Underweight: < 18.5
  - Normal: 18.5-24.9
  - Overweight: 25-29.9
  - Obese: >= 30
- Explanation section: how BMI is calculated, what the categories mean
- Disclaimer: "BMI is a screening tool, not a diagnosis. Consult a
  healthcare provider for health assessments."
- CopyButton on the Readout copies the BMI value

Calculation logic (bmi-calculator.util.ts):
- Metric: BMI = weight(kg) / (height(m))²
- Imperial: BMI = 703 * weight(lb) / (height(in))²
- Round to 1 decimal place
- Pure functions, fully testable in isolation

UI/design requirements:
- Use TextInput for height and weight
- Use SelectControl for unit toggle (or a segmented toggle)
- Use AppButton (secondary variant) for Reset
- Use CopyButton in Readout corner
- Readout: --color-readout-bg, --color-readout-text, --font-mono, tabular-nums
- Active value in --color-accent
- Acknowledgment pulse on value change (150ms opacity flicker)
- Explanation in reading column (720px max)
- Works in light and dark themes
- Responsive: inputs stack on mobile, row on desktop
- Respect reduced motion

Testing requirements:
- Unit tests for calculation logic (metric, imperial, edge cases, rounding)
- Unit tests for validation (empty, negative, zero, out of range)
- Component tests: renders inputs, reset works, result displays
- Component tests: validation messages appear on blur
- Component tests: unit toggle switches calculation
- Route test: tool resolves and renders in shell

Run type-check, lint, tests, and production build.
Verify in browser: enter values, check result, toggle units, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 8 — JSON Formatter

**Branch:** `phase2/02-json-formatter`
**Commit:** `feat: implement JSON Formatter tool`

```
Review these files before making changes:
- client/src/app/features/tools/tool-shell/tool-shell.ts
- client/src/app/features/tools/tool-shell/tool-page-contract.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/shared/components/textarea-control/textarea-control.ts
- client/src/app/shared/components/button/button.ts
- client/src/app/shared/components/copy-button/copy-button.ts
- client/src/assets/data/tool-registry.json
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts

Implement the JSON Formatter tool.

Create:
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.ts
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.html
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.scss
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.spec.ts
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.util.ts
- client/src/app/features/tools/development-web-tools/json-formatter/json-formatter.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (ensure json-formatter entry exists)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell's component-key-to-lazy-import map (add JsonFormatter)

Functional requirements:
- Large textarea for JSON input
- Format button: parses and re-serializes with 2-space indentation
- Minify button: parses and re-serializes with no whitespace
- Clear/Reset button: empties input and output
- Copy result button: copies formatted/minified output
- Error state: if JSON is invalid, show clear error message with line
  number if available (from JSON.parse error)
- Input size limit: warn if input exceeds 1MB (browser responsiveness)
- Output displayed in the Readout area (or a read-only textarea below input)
- Do NOT use eval or Function constructors
- Use JSON.parse and JSON.stringify only
- Do NOT insert raw HTML — output is always text, never innerHTML

Validation requirements:
- Empty input: show "Paste JSON to format" prompt
- Invalid JSON: show error message with the parse error text
- Valid JSON: show formatted output

UI/design requirements:
- TextareaControl for input (rows: 10-15, monospace font)
- AppButton (primary) for Format, (primary) for Minify, (secondary) for Reset
- CopyButton for the result
- Readout or output area: --font-mono, --color-readout-bg if using Readout
- Error messages: --color-error, Caption size
- Works in both themes
- Responsive: textarea full-width on all breakpoints
- Respect reduced motion

Testing requirements:
- Unit tests for formatJson (valid, nested, arrays, unicode)
- Unit tests for minifyJson (valid, nested, arrays)
- Unit tests for error handling (invalid syntax, trailing comma, unclosed)
- Unit tests for size limit warning
- Component tests: format button, minify button, reset, copy
- Component tests: error state displays message
- Route test: tool resolves and renders in shell

Run type-check, lint, tests, and production build.
Verify in browser: paste JSON, format, minify, reset, copy, invalid JSON.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 9 — Digital Clock

**Branch:** `phase2/03-digital-clock`
**Commit:** `feat: implement Digital Clock tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes. Also review:
- docs/design/08-animation-motion.md (Readout pulse, no spinner for
  synchronous tools)

Implement the Digital Clock tool.

Create:
- client/src/app/features/tools/time-date-tools/digital-clock/digital-clock.ts
- client/src/app/features/tools/time-date-tools/digital-clock/digital-clock.html
- client/src/app/features/tools/time-date-tools/digital-clock/digital-clock.scss
- client/src/app/features/tools/time-date-tools/digital-clock/digital-clock.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add digital-clock entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Display current time, updated every second
- 12-hour and 24-hour format toggle
- Show seconds (toggleable)
- Show date below the time
- Show timezone name and offset
- No user inputs — this is a display tool
- The Readout shows the time in --font-mono, tabular-nums
- Active time portion in --color-accent (amber)
- Use setInterval(1000), clear on destroy
- Guard with isPlatformBrowser (no timer during SSR — show static time
  from server render or empty)

UI/design requirements:
- Large Readout: time in --type-readout-size, date in --type-body-sm
- Toggle buttons for 12/24h and show/hide seconds
- No reset button (clock is always live)
- No copy button (time is constantly changing)
- Works in both themes
- Responsive: Readout scales down on mobile
- Respect reduced motion (no animation besides the time updating)

Testing requirements:
- Unit tests for time formatting (12h, 24h, with/without seconds)
- Unit tests for date formatting
- Unit tests for timezone display
- Component tests: renders time, toggle 12/24h works
- Route test: tool resolves and renders in shell

Run type-check, lint, tests, and production build.
Verify in browser: time updates, toggle format, check timezone.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 10 — Countdown Timer

**Branch:** `phase2/04-countdown-timer`
**Commit:** `feat: implement Countdown Timer tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Countdown Timer tool.

Create:
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.ts
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.html
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.scss
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.spec.ts
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.util.ts
- client/src/app/features/tools/time-date-tools/countdown-timer/countdown-timer.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add countdown-timer entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Inputs: hours, minutes, seconds (numeric, with inputmode=decimal)
- Start, Pause/Resume, Reset buttons
- Countdown displays in Readout (HH:MM:SS format)
- When timer reaches zero: show "Time's up" in Readout, fire a toast
  notification
- Validation: at least one field must be > 0 to start
- Timer uses setInterval(1000), cleared on pause/destroy
- Guard with isPlatformBrowser

UI/design requirements:
- TextInput for hours, minutes, seconds (compact, inline on desktop,
  stacked on mobile)
- AppButton primary for Start, secondary for Pause/Resume, ghost for Reset
- Readout: large, --font-mono, tabular-nums, amber for active countdown
- Acknowledgment pulse when timer reaches zero
- Works in both themes
- Responsive
- Respect reduced motion

Testing requirements:
- Unit tests for time formatting and remaining-time calculation
- Unit tests for validation
- Component tests: start, pause, resume, reset
- Component tests: timer reaches zero, toast fires
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: set time, start, pause, resume, reset, let it hit zero.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 11 — Loan Calculator

**Branch:** `phase2/05-loan-calculator`
**Commit:** `feat: implement Loan Calculator tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Loan Calculator tool.

Create:
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.ts
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.html
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.scss
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.spec.ts
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.util.ts
- client/src/app/features/tools/finance-money-tools/loan-calculator/loan-calculator.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (ensure loan-calculator entry exists)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Inputs: loan amount, annual interest rate, loan term (years or months)
- Term toggle: years or months
- Calculate monthly payment, total interest, total payment
- Display monthly payment in the Readout (currency formatted)
- Display total interest and total payment below
- Amortization summary (not full schedule) in explanation
- Reset button
- Validation: positive numbers, reasonable ranges
- inputmode=decimal for all numeric fields

Calculation (loan-calculator.util.ts):
- Monthly payment = P * r(1+r)^n / ((1+r)^n - 1)
  where P=principal, r=monthly rate (annual/12/100), n=number of payments
- Total payment = monthly * n
- Total interest = total payment - principal
- Pure functions, fully testable

UI/design requirements:
- TextInput for amount, rate, term
- SelectControl for years/months toggle
- AppButton primary for Calculate, secondary for Reset
- CopyButton for monthly payment
- Readout: monthly payment in amber
- Explanation: formula explanation, what the numbers mean
- Disclaimer: "Estimates only. Actual terms vary by lender."
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for calculation (various amounts, rates, terms)
- Unit tests for edge cases (zero rate, 1 month, 30 years)
- Unit tests for validation
- Component tests: inputs, calculate, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: enter values, calculate, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 12 — Percentage Calculator

**Branch:** `phase2/06-percentage-calculator`
**Commit:** `feat: implement Percentage Calculator tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Percentage Calculator tool.

Create:
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.ts
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.html
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.scss
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.spec.ts
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.util.ts
- client/src/app/features/tools/converters-calculators/percentage-calculator/percentage-calculator.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add percentage-calculator entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Three calculation modes:
  1. "What is X% of Y?" — inputs: percentage, base value
  2. "X is what % of Y?" — inputs: value, base value
  3. "Percentage change from X to Y" — inputs: original, new value
- Mode selector (SelectControl or segmented toggle)
- Result in Readout
- Reset button
- Validation: numeric inputs, non-zero denominator where applicable
- inputmode=decimal

UI/design requirements:
- SelectControl for mode
- TextInput for values (changes label per mode)
- AppButton secondary for Reset
- CopyButton for result
- Readout: result in amber
- Explanation: formula for the selected mode
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for all three calculation modes
- Unit tests for edge cases (zero, negative, 100%)
- Unit tests for validation
- Component tests: mode switch, inputs, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: all three modes, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 13 — Unit Converter

**Branch:** `phase2/07-unit-converter`
**Commit:** `feat: implement Unit Converter tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Unit Converter tool.

Create:
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.ts
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.html
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.scss
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.spec.ts
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.util.ts
- client/src/app/features/tools/converters-calculators/unit-converter/unit-converter.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add unit-converter entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Category selector: Length, Weight, Temperature, Area, Volume, Speed
- From-unit and to-unit selectors (SelectControl)
- Input value (TextInput, inputmode=decimal)
- Result in Readout
- Swap units button (swaps from/to)
- Reset button
- Conversion factors defined in util file as a data structure
- Temperature needs special handling (offset formula, not just multiply)

UI/design requirements:
- SelectControl for category, from-unit, to-unit
- TextInput for value
- AppButton ghost for swap, secondary for reset
- CopyButton for result
- Readout: converted value in amber
- Explanation: conversion formula or factor used
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for all categories and unit pairs
- Unit tests for temperature (C->F, F->C, C->K, etc.)
- Unit tests for edge cases (zero, negative where applicable)
- Component tests: category switch, unit swap, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: convert several units, swap, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 14 — Currency Converter

**Branch:** `phase2/08-currency-converter`
**Commit:** `feat: implement Currency Converter tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Currency Converter tool.

Create:
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.ts
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.html
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.scss
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.spec.ts
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.util.ts
- client/src/app/features/tools/finance-money-tools/currency-converter/currency-converter.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add currency-converter entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- From-currency and to-currency selectors (common currencies: USD, EUR,
  GBP, JPY, INR, CAD, AUD, CHF, CNY)
- Amount input (TextInput, inputmode=decimal)
- Result in Readout
- Swap currencies button
- Reset button
- Exchange rates: use a static JSON file with placeholder rates
  (client/src/assets/data/exchange-rates.json)
- Clearly label: "Rates are placeholders, not live. For reference only."
- Do NOT fetch live rates in this prompt — that requires a server-controlled
  API key and is out of scope

UI/design requirements:
- SelectControl for currencies
- TextInput for amount
- AppButton ghost for swap, secondary for reset
- CopyButton for result
- Readout: converted amount in amber, formatted to 2 decimal places
- Explanation: rate used, "not live" disclaimer
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for conversion math
- Unit tests for formatting (2 decimal places, currency symbols)
- Component tests: currency select, swap, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: convert, swap, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 15 — Word Counter

**Branch:** `phase2/09-word-counter`
**Commit:** `feat: implement Word Counter tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Word Counter tool.

Create:
- client/src/app/features/tools/work-productivity/word-counter/word-counter.ts
- client/src/app/features/tools/work-productivity/word-counter/word-counter.html
- client/src/app/features/tools/work-productivity/word-counter/word-counter.scss
- client/src/app/features/tools/work-productivity/word-counter/word-counter.spec.ts
- client/src/app/features/tools/work-productivity/word-counter/word-counter.util.ts
- client/src/app/features/tools/work-productivity/word-counter/word-counter.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add word-counter entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Large textarea for input text
- Live count (updates as user types, debounced 150ms):
  - Words
  - Characters (with and without spaces)
  - Sentences
  - Paragraphs (separated by blank lines)
  - Reading time (at 200 wpm)
- Readout shows word count as the primary value
- Secondary stats displayed below in a compact grid
- Reset button
- Copy button for the word count

UI/design requirements:
- TextareaControl (rows: 10)
- Readout: word count in amber
- Stats grid: 2 columns desktop, 1 column mobile
- AppButton secondary for reset
- CopyButton for word count
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for counting (empty, single word, multiple paragraphs,
  unicode, punctuation)
- Unit tests for reading time calculation
- Component tests: typing updates counts, reset clears
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: type text, check counts, reset.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 16 — Text Case Converter

**Branch:** `phase2/10-text-case-converter`
**Commit:** `feat: implement Text Case Converter tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Text Case Converter tool.

Create:
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.ts
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.html
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.scss
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.spec.ts
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.util.ts
- client/src/app/features/tools/document-language-tools/text-case-converter/text-case-converter.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add text-case-converter entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Large textarea for input text
- Case conversion buttons:
  - UPPERCASE
  - lowercase
  - Title Case
  - Sentence case
  - camelCase
  - snake_case
  - kebab-case
- Converted text shown in Readout area (read-only textarea or pre block)
- Copy button for converted text
- Reset button
- All transformations are pure string operations — no eval, no HTML

UI/design requirements:
- TextareaControl for input
- AppButton (secondary) for each case option
- Readout: converted text in --font-mono
- CopyButton for result
- AppButton ghost for reset
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for all case conversions
- Unit tests for edge cases (empty, numbers, mixed, unicode)
- Component tests: each button converts, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: type text, try each case, reset, copy.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 17 — Color Picker

**Branch:** `phase2/11-color-picker`
**Commit:** `feat: implement Color Picker tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Color Picker tool.

Create:
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.ts
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.html
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.scss
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.spec.ts
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.util.ts
- client/src/app/features/tools/creative-design-tools/color-picker/color-picker.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add color-picker entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Native color input (<input type="color">) for picking
- Hex text input for manual entry
- Display: HEX, RGB, HSL values for the selected color
- Copy buttons for each format
- Color preview swatch
- Reset to default (#000000 or #ffffff)

UI/design requirements:
- Color input + hex TextInput side by side
- Three value rows (HEX, RGB, HSL) each with CopyButton
- Large color preview swatch using --radius-md
- AppButton ghost for reset
- Readout: hex value in amber, --font-mono
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for color conversions (hex<->rgb<->hsl)
- Unit tests for validation (invalid hex, out of range rgb)
- Component tests: color input updates values, hex input updates, copy, reset
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: pick color, type hex, copy values, reset.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 18 — Gradient Generator

**Branch:** `phase2/12-gradient-generator`
**Commit:** `feat: implement Gradient Generator tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Gradient Generator tool.

Create:
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.ts
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.html
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.scss
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.spec.ts
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.util.ts
- client/src/app/features/tools/creative-design-tools/gradient-generator/gradient-generator.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add gradient-generator entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Two color pickers (start, end)
- Gradient type: linear or radial (toggle)
- Angle slider for linear (0-360 degrees)
- Live preview of the gradient
- CSS output string (e.g. "linear-gradient(45deg, #ff0000, #0000ff)")
- Copy button for CSS output
- Reset button

UI/design requirements:
- Two color inputs side by side
- SelectControl or toggle for linear/radial
- Range input for angle (shown only for linear)
- Large gradient preview area (--radius-md)
- Readout: CSS string in --font-mono, amber
- CopyButton for CSS
- AppButton ghost for reset
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for gradient string generation (linear, radial, various angles)
- Unit tests for color format handling
- Component tests: color changes update preview and output, type toggle,
  angle slider, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: pick colors, toggle type, adjust angle, copy CSS, reset.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 19 — Regex Tester

**Branch:** `phase2/13-regex-tester`
**Commit:** `feat: implement Regex Tester tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Regex Tester tool.

Create:
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.ts
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.html
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.scss
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.spec.ts
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.util.ts
- client/src/app/features/tools/development-web-tools/regex-tester/regex-tester.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add regex-tester entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Pattern input (TextInput)
- Flags input (TextInput, e.g. "gi")
- Test string (TextareaControl)
- Match results: list of matches with index, matched text, groups
- Match count in Readout
- Highlight matched substrings in the test string (use text rendering,
  never innerHTML with untrusted input — use Angular's DOM sanitization)
- Error handling: invalid regex shows clear error message
- Reset button
- Copy button for match count or first match

Security requirements:
- Use RegExp constructor with pattern and flags
- Do NOT use eval
- Do NOT insert raw HTML — use Angular's built-in sanitization or
  textContent for displaying matches
- Handle regex syntax errors gracefully

UI/design requirements:
- TextInput for pattern and flags
- TextareaControl for test string
- Readout: match count in amber
- Results list: each match with index and text
- Error message in --color-error
- AppButton ghost for reset
- CopyButton for match count
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for regex matching (simple, groups, global flag, no matches)
- Unit tests for error handling (invalid pattern, invalid flags)
- Component tests: enter pattern, enter test string, see matches, reset
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: enter regex, test string, check matches, error case, reset.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 20 — Base64 Encoder/Decoder

**Branch:** `phase2/14-base64-encoder`
**Commit:** `feat: implement Base64 Encoder/Decoder tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Base64 Encoder/Decoder tool.

Create:
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.ts
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.html
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.scss
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.spec.ts
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.util.ts
- client/src/app/features/tools/development-web-tools/base64-encoder/base64-encoder.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add base64-encoder entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Mode toggle: Encode / Decode
- TextInput or TextareaControl for input
- Result in Readout
- Encode button, Decode button (or auto-detect based on mode)
- Reset button
- Copy button for result
- Error handling: invalid base64 on decode shows clear error
- Use btoa/atob or TextEncoder/TextDecoder for UTF-8 support
- Do NOT use eval or Function constructors

UI/design requirements:
- SelectControl or toggle for Encode/Decode mode
- TextareaControl for input
- Readout: result in --font-mono, amber
- AppButton primary for action, ghost for reset
- CopyButton for result
- Error message in --color-error
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for encode (ASCII, unicode, empty)
- Unit tests for decode (valid, invalid, empty)
- Unit tests for UTF-8 handling
- Component tests: mode toggle, encode, decode, reset, copy, error
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: encode text, decode base64, reset, copy, error case.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 21 — Tip Calculator

**Branch:** `phase2/15-tip-calculator`
**Commit:** `feat: implement Tip Calculator tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Tip Calculator tool.

Create:
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.ts
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.html
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.scss
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.spec.ts
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.util.ts
- client/src/app/features/tools/everyday-practical-tools/tip-calculator/tip-calculator.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add tip-calculator entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Inputs: bill amount, tip percentage, number of people
- Quick tip buttons: 10%, 15%, 18%, 20%
- Custom tip percentage input
- Results: tip amount, total bill, per-person amount
- Readout shows per-person total (or tip amount, configurable)
- Reset button
- Validation: positive bill, positive people, non-negative tip
- inputmode=decimal for all numeric fields

UI/design requirements:
- TextInput for bill amount, custom tip, number of people
- AppButton (secondary) for quick tip percentages
- Readout: per-person total in amber
- Secondary results: tip amount, total bill
- AppButton ghost for reset
- CopyButton for per-person amount
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for calculations (various bills, tips, party sizes)
- Unit tests for validation
- Component tests: inputs, quick tip buttons, reset, copy
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: enter bill, select tip, set people, check results, reset.
Test at desktop, tablet, mobile in both themes.
```

---

## Prompt 22 — Random Picker

**Branch:** `phase2/16-random-picker`
**Commit:** `feat: implement Random Picker tool`

```
Review the existing tool shell, tool contract, registry, and shared
components before making changes.

Implement the Random Picker tool.

Create:
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.ts
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.html
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.scss
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.spec.ts
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.util.ts
- client/src/app/features/tools/everyday-practical-tools/random-picker/random-picker.util.spec.ts

Update:
- client/src/assets/data/tool-registry.json (add random-picker entry)
- client/src/assets/data/search-index.json
- client/src/app/features/tools/tool-registry.ts
- ToolShell component map

Functional requirements:
- Textarea for list of items (one per line)
- "Pick Random" button
- Result in Readout (the picked item)
- Option: pick multiple (N items, no repeats)
- Option: remove picked items from list
- Reset button (clears result, keeps list)
- Clear button (clears list)
- Uses Math.random or crypto.getRandomValues for randomness

UI/design requirements:
- TextareaControl for item list
- AppButton primary for "Pick Random"
- TextInput for "how many" (default 1)
- Readout: picked item in amber
- AppButton ghost for reset, ghost for clear
- CopyButton for result
- Works in both themes, responsive, reduced motion

Testing requirements:
- Unit tests for random selection (single, multiple, no repeats)
- Unit tests for edge cases (empty list, single item, more picks than items)
- Component tests: add items, pick, reset, clear
- Route test

Run type-check, lint, tests, and production build.
Verify in browser: add items, pick random, pick multiple, reset, clear.
Test at desktop, tablet, mobile in both themes.
```
