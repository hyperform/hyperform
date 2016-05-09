# ![Text “Hyperform - Insert Form” in 80s arcade game style](stuff/header.png)

## Capture form validation back from the browser

Hyperform is a complete implementation of the HTML 5 form validation API in
Javascript. It replaces the browser’s native methods (if it even implements
them…) and enriches it with custom events and hooks.

## Installation

The easiest way is installing via `npm`:

    npm install hyperform

Or download the [current version as ZIP
archive](https://github.com/hyperform/hyperform/archive/master.zip).

Then embed `dist/hyperform.min.js` in your file:

    <script src="path/to/hyperform/dist/hyperform.min.js"></script>

In old browsers you will need polyfills for the follwing features: `WeakMap`
(IE 10 and lower), array methods `filter` and `every`, object method `keys`,
`Object.defineProperty`, and `string`’s `trim()` method (IE 8 and lower).

## Usage

The library introduces the global variable `hyperform`. You can let Hyperform
take over a single form:

    hyperform(document.forms[0]);

or all forms, current and future ones:

    hyperform(window);

If you need only a certain feature, you can access it directly by name:

    hyperform.setCustomValidity.call(form.elements[0], 'my message');

## Status

What parts of the [HTML5 validation
API](https://html.spec.whatwg.org/multipage/forms.html#constraints) are ready
for prime time?

| feature                      | status             | comment            |
| ---------------------------- | ------------------ | ------------------ |
| `willValidate`               | :full_moon:        | :heavy_check_mark: |
| `setCustomValidity(message)` | :full_moon:        | :heavy_check_mark: |
| `validity.valueMissing`      | :full_moon:        | :heavy_check_mark: |
| `validity.typeMismatch`      | :full_moon:        | :heavy_check_mark: |
| `validity.patternMismatch`   | :full_moon:        | :heavy_check_mark: |
| `validity.tooLong`           | :full_moon:        | :heavy_check_mark: |
| `validity.tooShort`          | :full_moon:        | :heavy_check_mark: |
| `validity.rangeUnderflow`    | :full_moon:        | :heavy_check_mark: |
| `validity.rangeOverflow`     | :full_moon:        | :heavy_check_mark: |
| `validity.stepMismatch`      | :full_moon:        | :heavy_check_mark: |
| `validity.badInput`          | :waxing_gibbous_moon: | works for all but `type=email`. (That last one might be unfixable. See comment in [src/validators/bad_input.js](src/validators/bad_input.js).) |
| `validity.customError`       | :full_moon:        | :heavy_check_mark: |
| `validity.valid`             | :full_moon:        | :heavy_check_mark: (with restriction from `validity.badInput` above) |
| `checkValidity()`            | :full_moon:        | :heavy_check_mark: (with restriction from `validity.badInput` above) |
| `reportValidity()`           | :full_moon:        | :heavy_check_mark: (with restriction from `validity.badInput` above) |
| `validationMessage`          | :full_moon:        | :heavy_check_mark: |
| `valueAsDate`                | :full_moon:        | :heavy_check_mark: |
| `valueAsNumber`              | :full_moon:        | :heavy_check_mark: |
| `valueLow` / `valueHigh`     | :new_moon:         | not started, yet   |
| `stepUp(n)` / `stepDown(n)`  | :first_quarter_moon: | doesn’t work for date/time types, yet |
| `accept` attribute           | :new_moon:         | for `type=file` inputs. It’s useful to implement a check because there are browsers without support, that implement the File API. |
| support for `novalidate`     | :full_moon:        | :heavy_check_mark: |

What parts of the high-level API are finished?

* :new_moon: Trigger a `validate` event before validating an element.
* :full_moon: Trigger a `valid` event, when an input becomes valid, again.
* :new_moon: Allow functions to hook into the actual validations to accept or
    reject inputs.
* :waxing_crescent_moon: Translate validation messages. There are some
    partial translations available: https://github.com/hyperform/hyperform-l10n
* :full_moon: Provide a registry for user defined validators, that are called
    automatically in the `validity.customError` step.
* :full_moon: Catch form submissions _before_ the `submit` event to do our own
    validation (`click`s on submit buttons and `enter` keys in text inputs in
    forms w/o submit buttons).
* :new_moon: Add helper classes `hf-valid` and `hf-invalid` as well as proper
    `aria-invalid` to elements to become independent of `:valid` / `:invalid`
    pseudo-classes.
* :waxing_crescent_moon: Allow specifying settings to customize the behavior of Hyperform
    (e. g., specifying a renderer for error messages).
* :full_moon: Take single `<input>` elements out of validation by supporting a
    non-standard `novalidate` attribute and `noValidate` property for inputs:

        var element = document.querySelector('input[name="foo"]');
        element.noValidate = true;
        // done. element won't be validated.

Do you have a wish or an idea? [File an issue and let us discuss
it!](https://github.com/hyperform/hyperform/issues/new)

## Examples

Check out the files in the [`examples`
folder](https://github.com/hyperform/hyperform/tree/master/examples).

## License

This library is released under the terms of the [MIT license](LICENSE.md).
