# ![Text “Hyperform - Insert Form” in 80s arcade game style](https://hyperform.js.org/statics/header.png)
[![CDNJS](https://img.shields.io/cdnjs/v/hyperform.svg?colorB=green)](https://cdnjs.com/libraries/hyperform)
## Capture form validation back from the browser

Hyperform is your one-stop solution for client-side form handling.

It features a complete implementation of the HTML5 form validation API in
JavaScript, replaces the browser’s native methods (if they are even
implemented…), and enriches your toolbox with custom events and hooks.

Not pumped yet? Then [take a look](https://hyperform.js.org/examples.html) at
our awesome [examples](https://hyperform.js.org/examples.html).

## Installation

### Embed from a CDN

Get up and running with Hyperform by embedding it from a CDN:
[CDNJS](https://cdnjs.com/libraries/hyperform)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/hyperform/0.9.5/hyperform.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/hyperform/0.9.5/hyperform.min.css">
```

or unpkg.com:

```html
<script src="https://unpkg.com/hyperform"></script>
<link rel="stylesheet" href="https://unpkg.com/hyperform@latest/css/hyperform.css">
```

### Install locally

The easiest way is installing via `npm`:

```sh
npm install hyperform
```

or you can use Bower:

```sh
bower install hyperform
```

or download the [current version as ZIP
archive](https://github.com/hyperform/hyperform/archive/master.zip).

Then embed `dist/hyperform.min.js` in your file:

```html
<script src="path/to/hyperform/dist/hyperform.min.js"></script>
```

or require it in your code:

```js
const hyperform = require('hyperform');
```

In old browsers you will need polyfills for the following features:
[`WeakMap`](https://github.com/Benvie/WeakMap) (IE 10 and lower),
[`element.classList`](https://github.com/remy/polyfills) (IE 9 and lower),
`array.filter`, `array.every`, `Object.keys` and
`Object.defineProperty` (IE 8 and lower). For IE 9+ support simply add this
line to use [Polyfill.io’s service](https://polyfill.io):

```html
<script src="https://polyfill.io/v2/polyfill.min.js?features=Element.prototype.classList,WeakMap"></script>
```

## Usage

You can let Hyperform take over a single form:

```js
hyperform(document.forms[0]);
```

or all forms, current and future ones:

```js
hyperform(window);
```

Configure settings as second argument:

```js
hyperform(window, { revalidate: 'never' });
```

If you only need a certain feature once, you can access it directly by name:

```js
if (hyperform.willValidate(some_input_element)) {
    var is_valid = hyperform.validityState(some_input_element).valid;
}
```

[The full documentation](https://hyperform.js.org/docs/) provides you with all
the nitty-gritty details and tricks.

### What About the UI?

You might be wondering, how to get nifty datepickers and range sliders and
stuff. Unfortunately, this is out of topic for Hyperform, but despair not!
[Hyperform UI](https://github.com/hyperform/hyperform-ui) (beta) is here to
fill in the gaps with the help of jQuery UI.

> “jQuery UI? Isn’t that that thing that they had before React?” — “No, that’s
> Backbone.” — “But before that?” — “No, that was Kendo.” — “...?”

If you had these thoughts right now, rest assured. For the purpose of input
widgets there is still close to no other library, that is complete, themable,
accessible and has wide browser support. Just try it yourself!

## Examples

[Yes, please! The more the better.](https://hyperform.js.org/examples.html)

## Status

The target is 100% support for the [HTML5 validation
API](https://html.spec.whatwg.org/multipage/forms.html#constraints). Currently
supported:

| feature                      | status      |
| ---------------------------- | ----------- |
| `willValidate`               | :full_moon: |
| `setCustomValidity(message)` | :full_moon: |
| `validity.valueMissing`      | :full_moon: |
| `validity.typeMismatch`      | :full_moon: |
| `validity.patternMismatch`   | :full_moon: |
| `validity.tooLong`           | :full_moon: |
| `validity.tooShort`          | :full_moon: |
| `validity.rangeUnderflow`    | :full_moon: |
| `validity.rangeOverflow`     | :full_moon: |
| `validity.stepMismatch`      | :full_moon: |
| `validity.badInput`          | :full_moon: |
| `validity.customError`       | :full_moon: |
| `validity.valid`             | :full_moon: |
| `checkValidity()`            | :full_moon: |
| `reportValidity()`           | :full_moon: |
| `validationMessage`          | :full_moon: |
| `valueAsDate`                | :full_moon: |
| `valueAsNumber`              | :full_moon: |
| `valueLow` / `valueHigh`     | :new_moon:  |
| `stepUp(n)` / `stepDown(n)`  | :full_moon: |
| `accept` attribute           | :full_moon: |
| support for `novalidate`     | :full_moon: |

Current test status: [![View on Travis CI](https://api.travis-ci.org/hyperform/hyperform.svg?branch=master)](https://travis-ci.org/hyperform/hyperform)

### Browser Support

Hyperform is fully tested and supported in

* Chrome (latest 3)
* Firefox (latest 3 and ESR)
* MS Edge (latest)
* IE down to version 9 (yes, you've read that correctly) when `WeakMap` for IE
    ≤ 10 and `classList` for IE 9 are polyfilled
* Safari. _Caveat:_ In versions ≤ 9 [polyfills do not
    work](https://github.com/hyperform/hyperform/issues/16). However, form
    validation and direct method calling works as expected.)

## Contributing

Cool, yes! Head over to the [contributing guide](CONTRIBUTING.md) for details.

## Changelog

We maintain an up-to date [changelog named `CHANGELOG.md`](CHANGELOG.md)
alongside this file.

## License

This library is released under the terms of the [MIT license](LICENSE.md).

## Contributors

Hyperform is developed by [Manuel Strehl](https://twitter.com/m_strehl) with
contributions by
[Andrey Volynkin](https://github.com/Avol-V),
[Daniel Wang](https://github.com/pvnr0082t),
[Darlan Mendonça](https://github.com/darlanmendonca),
[Christoph Dörfel](https://github.com/Garbanas),
[Josh Farneman](https://github.com/farneman),
[Casey Corcoran](https://github.com/snaptopixel),
and many people reporting issues.
