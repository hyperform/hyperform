# Changelog

## UNRELEASED

## v0.11.0

* switch build tool to rollup
* remove deprecated underscore names
* fix revalidation for forms with novalidate attribute

## v0.10.2

* fix form validation error for detached elements

## v0.10.1

* fix event properties being set too late

## v0.10.0

* add new event "implicit_submit", that allows to prevent implicit submits

## v0.9.23

* fix application of class hf-user-invalid to checkboxes/radio buttons

## v0.9.22

* fix select boxes not respectin placeholder options
* validate dates stricter
* add TypeScript declarations

## v0.9.21

* fix problem, where badInput was not detected with hyperform(form) calls (issue #49)

## v0.9.20

* hide empty warnings with CSS
* fix select boxes with disabled options selected validating as required

## v0.9.19

* fix custom validation messages gone missing (regression from v0.9.17)

## v0.9.18

* prevent infinite loops from custom validators

## v0.9.17

* add tests to npm package
* live-update warnings, when `setCustomValidity()` is called
* properly delete custom messages

## v0.9.16

* fix radio button warnings still being multiplied on submit

## v0.9.15

* update some dependencies
* add `CHANGELOG.md`
* prevent `is_validation_candidate()` from running twice for each validation
* re-allow validation of elements without `name` attribute, if asked directly
* fix validation for partly required radio groups
* on form validation show only one warning per radio group

## v0.9.14

* prevent non-candidates from being handled

## v0.9.13

* fix tabbing into fields triggering revalidation

## v0.9.12

* fix `element.noValidate` being broken

## v0.9.11

* do not validate elements without name
* add guard against trying to remove a detached warning
* start removing default imports and add comments
* switch to `babel-preset-env`
* add a command to quickly generate a `.po` file for l10n

## v0.9.10

* Connect error messages via `aria-describedby`

## v0.9.9

* update README

## v0.9.8

* Fix for IE 10 & 11 not supporting multiple parameters for classList add() and remove() methods

## v0.9.7

* fix "novalidateOnElements" not added to settings

## v0.9.6

* use translation for base language, if available

## v0.9.5

* trigger a "forminvalid" event

## v0.9.4

* add option to autoload Hyperform

## v0.9.3

* fix bower.json's main field

## v0.9.2

* fix wrong value in `tooShort` message

## v0.9.1

* convert renderer methods to camelCase, too

## v0.9.0

* switch from snake_case to camelCase for public API
* upgrade ava (please run "npm install" after pull)
* remove mobile clients from test matrix, since they throw strange SauceLabs errors
* split "make test" in sub-targets
* extend saucelabs browsers to mobile
* fix Safari `<=` 9 throwing error on uninstalling properties
* enable tests for IE 9/10
* crank up the test matrix
* implement better "clicked on child of `<button>`" detection

## v0.8.15

* fix IE `<=` 10 not knowing HTMLDocument

## v0.8.14

* reintroduce accidentally deleted Firefox safe-guard

## v0.8.13

* change the way we evaluate prevented submit event
* for whatever reason `insertRule()` now needs an explicit index

## v0.8.12

* add support for `\n` in error messages
* fix child nodes mixing up `event.target` of button clicks

## v0.8.11

* allow filtering is_validation_candidate result

## v0.8.10

* make logging optional with debug=bool setting
* add `.hf-user-valid`
* add more classes to mirror pseudo-classes
* adapt the date rendering in date and time input error messages

## v0.8.9

* fix IE not setting `defaultPrevented`

## v0.8.8

* catch case, where native properties cannot be overloaded

## v0.8.7

* ignore non-essential files on (bower|npm) install

## v0.8.6

* fix the `prevent_implicit_submit` switch

## v0.8.5

* add setting `prevent_implicit_submit`
* apparently `originalTarget` is a protected getter on `Event`
* streamline form submission better

## v0.8.4

* fix some problems with non-AJAX form submission

## v0.8.3

* filter attributes before being set/get

## v0.8.2

* fix evaluation of "formnovalidate" on submit buttons

## v0.8.1

* fix polyfills not being applied in global context
* create hook registry w/o prototype
* add add_filter as alias to add_hook
* add current value as param to filters
* add call_filter to filter a value through hooks
* add hook infrastructure

## v0.8.0

* rename hyperform.register to hyperform.add_validator

## v0.7.7

* unify form submission a bit
* add name=value of submit button to form submit

## v0.7.6

* disallow multiple wrappers per form

## v0.7.5

* complete uninstall process
* define attribute helpers
* fix calling issue and tests
* add a "polyunfill" method mirroring polyfill()
* create dedicated "polyfill" method
* add a hybrid re-evaluation strategy
* fix leaking implementation
* allow renderer to be reset to default

## v0.7.4

* add /css to "files" setting in package.json
* remove necessity for some ES6 shims
* fix detection of revalidate=never
* `const`-antize all the things!
* fall back to attribute data-validator for custom validation messages
* fix "blur" event delegation
* allow "onblur" for settings.revalidate
* support "never" for settings.revalidate
* add support for per-element custom messages
* make naming of component clearer
* uninstall more properties
* refactor validity checkers
* factor out the huge validity state checkers
* fix calls to polyfill w/ changed signature
* change rest of polyfills to use explicit element arg
* change some polyfills from `this` to explicit arg
* set aria-live=polite on warnings
* enhance setting propagation
* switch case for a class
* add a destroy method to Wrapper
* polyfill some properties like element.maxLength
* trim email/url before validation
* fix possible loop in bad_input validator
* postpone creation of DOM elements
* add support for children of `<datalist>` not being validated
* change overwrite behavior of property_installer
* add missing methods to `<form>`

## v0.7.3

* branch out attach/detach renderer
* fix naming error

## v0.7.2

* make classes for validation / warnings configurable
* fix get_wrapper import :(
* make Wrapper.get_wrapped a standalone function

## v0.7.1

* fix wrong values in error messages
* fix bogged export

## v0.7.0

* add proper AMD and CJS versions

## v0.6.3

* fix evaluation of original badInput

## v0.6.2

* try to evaluate the original badInput state, too

## v0.6.1

* allow non-boolean returns in custom validators

## v0.6.0

* s/hyperform.add_renderer/hyperform.set_renderer/

## v0.5.12

* focus first invalid field on submit validation

## v0.5.11

* trigger a submit event manually when catching the original form submit
* fix wrong validity calculation
* call warning renderer for all radio buttons w/ same name
* change the way custom validators are called in customError

## v0.5.10

* fix setCustomValidity setter

## v0.5.9

* fix try to set property on possible primitive

## v0.5.8

* know your own wrapper functions...

## v0.5.7

* trigger "validate" on form before submit

## v0.5.6

* do report errors on input validation

## v0.5.5

* fix reportValidity not removing warning

## v0.5.4

* fix the way the wrapped container is fetched
* implement shortcut to find wrapper for element

## v0.5.3

* fix problems with maxlength (D'oh!) and Unicode string length

## v0.5.2

* apparently getElementsByName is not available on Element

## v0.5.1

* support dates in get_next_value
* put step validation consts in own file
* confirm step working as specced
* fix ms calculation

## v0.5.0

* add support for @accept
* fix minor errors

## v0.4.8

* add proper classes hf-(in)valid and aria-invalid on validation

## v0.4.7

* run validation for _all_ inputs of a form

## v0.4.6

* fix annoying errors

## v0.4.5

* add Wrapper.install to allow adding fields dynamically

## v0.4.4

* add support for a non-custom "valid" event

## v0.4.3

* enhance `<fieldset>` support

## v0.4.2

* add support for non-standard "novalidate" on `<input>` elements

## v0.4.1

* make sure the registry always returns an array
* allow more than one custom validator per element

## v0.4.0

* add a registry for user-defined validators

## v0.3.1

* update README

## v0.3.0

* correct wrong typeof test
* change public API to simple callable
* support novalidate in submit catcher
* add first versions of step(Up|Down)
* fix type detection for valueAs*
* make step validation for months more robust

## v0.2.4

* add checkmarks to feature table

## v0.2.3

* update README

## v0.2.2

* reset the validity again, when an element becomes valid
* set the validation msg via original setCustomValidity
* add styles
* determine the type of an input more reliably

## v0.2.1

* fix issues and mask the WeakMap in message_store
* catch form submission and call our own reportValidity
* fix bugs
* react appropriately in reportValidity, when event is canceled
* publish Renderer.set as hyperform.add_renderer

## v0.2.0

* fix step validator for type=month
* allow overflowing months / dates

## v0.1.9

* restrict npm package to src and dist folders
* change l10n infrastructure

## v0.1.8

* make code more robust thanks to tests
* update bower keyword list
* fix npm version script

## v0.1.7

* add bower.json (for the good old times)
* publish original method as `_original_method`

## v0.1.6

* support "jsnext:main" in package.json
* implement most of ValidityState.badInput
* disallow mark() on primitives

## v0.1.5

* fix problem with string_to_date parser

## v0.1.4

* fix determining current version during npm version bump

## v0.1.3

* switch to npm version for bumping versions

## v0.1.2

* allow step validator to consume most date types
* add license

## v0.1.1

* support date types in max/min validators
* prepare date support for validators
* put type information in single place
* fix minor issues
* mark all polyfills with a "hyperform" property
* change the way element.validity is installed
* allow capturing all inputs via prototype
* fix array search, rebuild
* change sprintf implementation
* fix getting Date from a week number
* fix valueAs* and add jsdom to tests
* fix padding in date_to_string
* fix valueAs*.install
* add valueAsNumber and fix issues with valueAsDate
* add polyfill for valueAsDate
* add version to interface
* fix some errors
* add build infrastructure
* start implementing the HTML5 form validation API
