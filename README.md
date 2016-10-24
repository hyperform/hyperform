# ![Text “Hyperform - Insert Form” in 80s arcade game style](stuff/header.png)

## Capture form validation back from the browser

Hyperform is a complete implementation of the HTML 5 form validation API in
Javascript. It replaces the browser’s native methods (if it even implements
them…) and enriches it with custom events and hooks.

## Installation

The easiest way is installing via `npm`:

```sh
npm install hyperform
```

or if you use Bower:

```sh
bower install hyperform
```

or download the [current version as ZIP
archive](https://github.com/hyperform/hyperform/archive/master.zip).

Then embed `dist/hyperform.min.js` in your file:

```html
<script src="path/to/hyperform/dist/hyperform.min.js"></script>
```

In old browsers you will need polyfills for the following features:
[`WeakMap`](https://github.com/Benvie/WeakMap) (IE 10 and lower),
[`element.classList`](https://github.com/remy/polyfills) (IE 9 and lower),
`array.filter`, `array.every`, `Object.keys` and
`Object.defineProperty` (IE 8 and lower).

## Usage

The library introduces the global variable `hyperform`. You can let Hyperform
take over a single form:

```js
hyperform(document.forms[0]);
```

or all forms, current and future ones:

```js
hyperform(window);
```

Configure settings as second argument:

```js
hyperform(window, {
    strict: false,         // default. En- or disable some high-level APIs

    revalidate: 'oninput', // default. Whether fields should be
                           // re-validated automatically. Valid values:
                           // `oninput`, `onsubmit`, and `never`.

    valid_event: true,     // default. Whether the non-standard `valid`
                           // event should be triggered
});
```

If you only need a certain feature, you can access it directly by name:

```js
if (hyperform.willValidate(form.elements[0])) {
    var is_valid = hyperform.validityState(form.elements[0]).valid;
}
```

## Examples

[Check out the awesome examples!](https://hyperform.js.org/examples.html)

## Status

What parts of the [HTML5 validation
API](https://html.spec.whatwg.org/multipage/forms.html#constraints) are ready
for prime time?

| feature                      | status      | comment            |
| ---------------------------- | ----------- | ------------------ |
| `willValidate`               | :full_moon: | :heavy_check_mark: |
| `setCustomValidity(message)` | :full_moon: | :heavy_check_mark: |
| `validity.valueMissing`      | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.typeMismatch`      | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.patternMismatch`   | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.tooLong`           | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.tooShort`          | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.rangeUnderflow`    | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.rangeOverflow`     | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.stepMismatch`      | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.badInput`          | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.customError`       | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `validity.valid`             | :full_moon: | :heavy_check_mark: (access via `hyperform.validityState`) |
| `checkValidity()`            | :full_moon: | :heavy_check_mark: |
| `reportValidity()`           | :full_moon: | :heavy_check_mark: |
| `validationMessage`          | :full_moon: | :heavy_check_mark: |
| `valueAsDate`                | :full_moon: | :heavy_check_mark: |
| `valueAsNumber`              | :full_moon: | :heavy_check_mark: |
| `valueLow` / `valueHigh`     | :new_moon:  | not started, yet   |
| `stepUp(n)` / `stepDown(n)`  | :full_moon: | :heavy_check_mark: |
| `accept` attribute           | :full_moon: | :heavy_check_mark: for `type=file` inputs. It’s useful to implement a check because there are browsers without support, that implement the File API. |
| support for `novalidate`     | :full_moon: | :heavy_check_mark: |

What parts of the high-level API are finished?

*   :full_moon: Trigger a `validate` event before validating a form:

    ```js
    form.addEventListener('validate', event => {
      /* cancel validation (will also cancel form submission!) */
      event.preventDefault();
    });
    ```

*   :full_moon: Trigger a `validated` event after validating a form:

    ```js
    form.addEventListener('validated', event => {
      /* cancel validation (will also cancel form submission!) */
      event.preventDefault();
    });
    ```

*   :new_moon: Trigger an event before validating individual elements.

*   :full_moon: Trigger a `valid` event, when an input becomes valid, again:

    ```js
    input.addEventListener('valid', () => alert('Yay!'));
    ```

*   :new_moon: Allow functions to hook into the actual validations to accept or
    reject inputs.

*   :first_quarter_moon: Translate validation messages. We have some partial
    translations ready: https://github.com/hyperform/hyperform-l10n

*   :full_moon: Provide a registry for user defined validators, that are called
    automatically in the `validity.customError` step:

    ```js
    hyperform.register(element, function(element) {
      return result_of_convoluted_validation_routine();
    });
    ```

*   :full_moon: Catch form submissions _before_ the `submit` event to do our
    own validation (`click`s on submit buttons and `enter` keys in text inputs
    in forms w/o submit buttons).

*   :full_moon: Add helper classes `hf-valid` and `hf-invalid` as well as
    proper `aria-invalid` to elements to become independent of `:valid` /
    `:invalid` pseudo-classes.

*   :first_quarter_moon: Allow specifying settings to customize the behavior of
    Hyperform (e. g., specifying a renderer for error messages).

*   :full_moon: Take single `<input>` elements out of validation by supporting
    a non-standard `novalidate` attribute and `noValidate` property for inputs:

    ```js
    var element = document.querySelector('input[name="foo"]');
    element.noValidate = true;
    // done. element won't be validated.
    ```

*   :new_moon: Add support for declarative custom validation messages:

    ```html
    <input data-validation-message="We need this field!">
    ```

*   :new_moon: Idea: Add a means of linking two `<input>`s together so they get
    validated synchronously:

    ```js
    hyperform.link(element1, element2);
    element1.reportValidity();
    // element2.reportValidity gets triggered automatically
    ```

Do you have a wish or an idea? [File an issue and let us discuss
it!](https://github.com/hyperform/hyperform/issues/new)

## License

This library is released under the terms of the [MIT license](LICENSE.md).
