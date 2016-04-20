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

## Usage

The library introduces the global variable `hyperform`. You can let Hyperform
take over a single form:

    hyperform.capture(document.forms[0]);

or all forms, current and future ones:

    hyperform.capture(document);

If you need only a certain feature, you can access it directly by name:

    hyperform.setCustomValidity.call(form.elements[0], 'my message');

## Status

What parts of the [HTML5 validation
API](https://html.spec.whatwg.org/multipage/forms.html#constraints) are ready
for prime time?

| feature                      | status             | comment |
| ---------------------------- | ------------------ | ------- |
| `willValidate`               | :full_moon: |  |
| `setCustomValidity(message)` | :waning_gibbous_moon: | Finished apart from support for `<fieldset>` elements. |
| `validity.valueMissing`      | :full_moon: |  |
| `validity.typeMismatch`      | :full_moon: |  |
| `validity.patternMismatch`   | :full_moon: |  |
| `validity.tooLong`           | :full_moon: |  |
| `validity.tooShort`          | :full_moon: |  |
| `validity.rangeUnderflow`    | :full_moon: |  |
| `validity.rangeOverflow`     | :full_moon: |  |
| `validity.stepMismatch`      | :last_quarter_moon: | Step validation for `type=month` is incorrect, yet |
| `validity.badInput`          | :new_moon: | This one is hard. Will take a bit. |
| `validity.customError`       | :full_moon: |  |
| `validity.valid`             | :waning_gibbous_moon: | Depends on the other validations above. Apart from that, finished. |
| `checkValidity()`            | :waning_gibbous_moon: | Depends on `ValidityState`. Apart from that, finished. |
| `reportValidity()`           | :last_quarter_moon: | Depends on `ValidityState`. Needs a bit more love for the error message renderer. Will render error, even if `invalid` event is cancelled. |
| `validationMessage`          | :full_moon: |  |
| `valueAsDate`                | :full_moon: |  |
| `valueAsNumber`              | :full_moon: |  |
| `valueLow` / `valueHigh`     | :new_moon:  | not started, yet |
| `stepUp(n)` / `stepDown(n)`  | :new_moon:  | not started, yet |
| `accept` attribute           | :new_moon:  | for `type=file` inputs. Is it useful to implement a check here? There are browsers without support here, that implement the File API. So we could totally do it. |
| support for `novalidate`     | :new_moon:  |  |

What parts of the high-level API are finished?

* [ ] Trigger a `validate` event before validating an element.
* [ ] Trigger a `valid` event, when an input becomes valid, again.
* [ ] Allow functions to hook into the actual validations to accept or reject
    inputs.
* [ ] Translate validation messages.
* [ ] Add a registry for custom validators for inputs, that are called
    automatically in the `validity.customError` step.
* [ ] Catch form submissions _before_ the `submit` event to do our own
    validation (`click`s on submit buttons and `enter` keys in text inputs in
    forms w/o submit buttons).
* [ ] Add helper classes `valid` and `invalid` as well as proper `aria-invalid`
    to elements to become independent of `:valid` / `:invalid` pseudo-classes.
* [ ] Allow specifying settings to customize the behavior of Hyperform (e.g.,
    specifying a renderer for error messages).

Do you have a wish or an idea? [File an issue and let us discuss
it!](https://github.com/hyperform/hyperform/issues/new)

## License

This library is released under the terms of the [MIT license](LICENSE.md).
