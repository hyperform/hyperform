/*! hyperform.js.org */
define(function () { 'use strict';

        var registry = Object.create(null);

        /**
         * run all actions registered for a hook
         *
         * Every action gets called with a state object as `this` argument and with the
         * hook's call arguments as call arguments.
         *
         * @return mixed the returned value of the action calls or undefined
         */
        function callHook(hook) {
          var result;
          var callArgs = Array.prototype.slice.call(arguments, 1);

          if (hook in registry) {
            result = registry[hook].reduce(function (args) {

              return function (previousResult, currentAction) {
                var interimResult = currentAction.apply({
                  state: previousResult,
                  hook: hook
                }, args);
                return interimResult !== undefined ? interimResult : previousResult;
              };
            }(callArgs), result);
          }

          return result;
        }

        /**
         * Filter a value through hooked functions
         *
         * Allows for additional parameters:
         * js> doFilter('foo', null, currentElement)
         */
        function doFilter(hook, initialValue) {
          var result = initialValue;
          var callArgs = Array.prototype.slice.call(arguments, 1);

          if (hook in registry) {
            result = registry[hook].reduce(function (previousResult, currentAction) {
              callArgs[0] = previousResult;
              var interimResult = currentAction.apply({
                state: previousResult,
                hook: hook
              }, callArgs);
              return interimResult !== undefined ? interimResult : previousResult;
            }, result);
          }

          return result;
        }

        /**
         * remove an action again
         */
        function removeHook(hook, action) {
          if (hook in registry) {
            for (var i = 0; i < registry[hook].length; i++) {
              if (registry[hook][i] === action) {
                registry[hook].splice(i, 1);
                break;
              }
            }
          }
        }
        /**
         * add an action to a hook
         */
        function addHook(hook, action, position) {
          if (!(hook in registry)) {
            registry[hook] = [];
          }
          if (position === undefined) {
            position = registry[hook].length;
          }
          registry[hook].splice(position, 0, action);
        }

        /**
         * return either the data of a hook call or the result of action, if the
         * former is undefined
         *
         * @return function a function wrapper around action
         */
        function returnHookOr (hook, action) {
          return function () {
            var data = callHook(hook, Array.prototype.slice.call(arguments));

            if (data !== undefined) {
              return data;
            }

            return action.apply(this, arguments);
          };
        }

        /* the following code is borrowed from the WebComponents project, licensed
         * under the BSD license. Source:
         * <https://github.com/webcomponents/webcomponentsjs/blob/5283db1459fa2323e5bfc8b9b5cc1753ed85e3d0/src/WebComponents/dom.js#L53-L78>
         */
        // defaultPrevented is broken in IE.
        // https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called

        var workingDefaultPrevented = function () {
          var e = document.createEvent('Event');
          e.initEvent('foo', true, true);
          e.preventDefault();
          return e.defaultPrevented;
        }();

        if (!workingDefaultPrevented) {
          (function () {
            var origPreventDefault = window.Event.prototype.preventDefault;
            window.Event.prototype.preventDefault = function () {
              if (!this.cancelable) {
                return;
              }

              origPreventDefault.call(this);

              Object.defineProperty(this, 'defaultPrevented', {
                get: function get() {
                  return true;
                },
                configurable: true
              });
            };
          })();
        }
        /* end of borrowed code */

        function triggerEvent (element, event) {
          var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

          var _ref$bubbles = _ref.bubbles;
          var bubbles = _ref$bubbles === undefined ? true : _ref$bubbles;
          var _ref$cancelable = _ref.cancelable;
          var cancelable = _ref$cancelable === undefined ? false : _ref$cancelable;
          var payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

          if (!(event instanceof window.Event)) {
            var newEvent = document.createEvent('Event');
            newEvent.initEvent(event, bubbles, cancelable);
            event = newEvent;
          }

          for (var key in payload) {
            if (payload.hasOwnProperty(key)) {
              event[key] = payload[key];
            }
          }

          element.dispatchEvent(event);

          return event;
        }

        /* and datetime-local? Spec says “Nah!” */

        var dates = ['datetime', 'date', 'month', 'week', 'time'];

        var plainNumbers = ['number', 'range'];

        /* everything that returns something meaningful for valueAsNumber and
         * can have the step attribute */
        var numbers = dates.concat(plainNumbers, 'datetime-local');

        /* the spec says to only check those for syntax in validity.typeMismatch.
         * ¯\_(ツ)_/¯ */
        var typeChecked = ['email', 'url'];

        /* check these for validity.badInput */
        var inputChecked = ['email', 'date', 'month', 'week', 'time', 'datetime', 'datetime-local', 'number', 'range', 'color'];

        var textTypes = ['text', 'search', 'tel', 'password'].concat(typeChecked);

        /* input element types, that are candidates for the validation API.
         * Missing from this set are: button, hidden, menu (from <button>), reset and
         * the types for non-<input> elements. */
        var validationCandidates = ['checkbox', 'color', 'file', 'image', 'radio', 'submit'].concat(numbers, textTypes);

        /* all known types of <input> */
        var inputs = ['button', 'hidden', 'reset'].concat(validationCandidates);

        /* apparently <select> and <textarea> have types of their own */
        var nonInputs = ['select-one', 'select-multiple', 'textarea'];

        /**
         * mark an object with a '__hyperform=true' property
         *
         * We use this to distinguish our properties from the native ones. Usage:
         * js> mark(obj);
         * js> assert(obj.__hyperform === true)
         */

        function mark (obj) {
          if (['object', 'function'].indexOf(typeof obj) > -1) {
            delete obj.__hyperform;
            Object.defineProperty(obj, '__hyperform', {
              configurable: true,
              enumerable: false,
              value: true
            });
          }

          return obj;
        }

        /**
         * the internal storage for messages
         */
        var store = new WeakMap();

        /* jshint -W053 */
        var messageStore = {
          set: function set(element, message) {
            var isCustom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (element instanceof window.HTMLFieldSetElement) {
              var wrappedForm = getWrapper(element);
              if (wrappedForm && !wrappedForm.settings.extendFieldset) {
                /* make this a no-op for <fieldset> in strict mode */
                return messageStore;
              }
            }

            if (typeof message === 'string') {
              message = new String(message);
            }
            if (isCustom) {
              message.isCustom = true;
            }
            mark(message);
            store.set(element, message);

            /* allow the :invalid selector to match */
            if ('_original_setCustomValidity' in element) {
              element._original_setCustomValidity(message.toString());
            }

            return messageStore;
          },
          get: function get(element) {
            var message = store.get(element);
            if (message === undefined && '_original_validationMessage' in element) {
              /* get the browser's validation message, if we have none. Maybe it
               * knows more than we. */
              message = new String(element._original_validationMessage);
            }
            return message ? message : new String('');
          },
          delete: function _delete(element) {
            if ('_original_setCustomValidity' in element) {
              element._original_setCustomValidity('');
            }
            return store.delete(element);
          }
        };

        /**
         * counter that will be incremented with every call
         *
         * Will enforce uniqueness, as long as no more than 1 hyperform scripts
         * are loaded. (In that case we still have the "random" part below.)
         */

        var uid = 0;

        /**
         * generate a random ID
         *
         * @see https://gist.github.com/gordonbrander/2230317
         */
        function generateId () {
          var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'hf_';

          return prefix + uid++ + Math.random().toString(36).substr(2);
        }

        var warningsCache = new WeakMap();

        var DefaultRenderer = {

          /**
           * called when a warning should become visible
           */
          attachWarning: function attachWarning(warning, element) {
            /* should also work, if element is last,
             * http://stackoverflow.com/a/4793630/113195 */
            element.parentNode.insertBefore(warning, element.nextSibling);
          },

          /**
           * called when a warning should vanish
           */
          detachWarning: function detachWarning(warning, element) {
            warning.parentNode.removeChild(warning);
          },

          /**
           * called when feedback to an element's state should be handled
           *
           * i.e., showing and hiding warnings
           */
          showWarning: function showWarning(element) {
            var subRadio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var msg = messageStore.get(element).toString();
            var warning = warningsCache.get(element);

            if (msg) {
              if (!warning) {
                var wrapper = getWrapper(element);
                warning = document.createElement('div');
                warning.className = wrapper && wrapper.settings.classes.warning || 'hf-warning';
                warning.id = generateId();
                warning.setAttribute('aria-live', 'polite');
                warningsCache.set(element, warning);
              }

              element.setAttribute('aria-errormessage', warning.id);
              warning.textContent = msg;
              Renderer.attachWarning(warning, element);
            } else if (warning && warning.parentNode) {
              element.removeAttribute('aria-errormessage');
              Renderer.detachWarning(warning, element);
            }

            if (!subRadio && element.type === 'radio' && element.form) {
              /* render warnings for all other same-name radios, too */
              Array.prototype.filter.call(document.getElementsByName(element.name), function (radio) {
                return radio.name === element.name && radio.form === element.form;
              }).map(function (radio) {
                return Renderer.showWarning(radio, 'subRadio');
              });
            }
          }

        };

        var Renderer = {

          attachWarning: DefaultRenderer.attachWarning,
          detachWarning: DefaultRenderer.detachWarning,
          showWarning: DefaultRenderer.showWarning,

          set: function set(renderer, action) {
            if (!action) {
              action = DefaultRenderer[renderer];
            }
            Renderer[renderer] = action;
          }

        };

        /**
         * check element's validity and report an error back to the user
         */
        function reportValidity(element) {
          /* if this is a <form>, report validity of all child inputs */
          if (element instanceof window.HTMLFormElement) {
            return Array.prototype.map.call(element.elements, reportValidity).every(function (b) {
              return b;
            });
          }

          /* we copy checkValidity() here, b/c we have to check if the "invalid"
           * event was canceled. */
          var valid = ValidityState(element).valid;
          var event;
          if (valid) {
            var wrappedForm = getWrapper(element);
            if (wrappedForm && wrappedForm.settings.validEvent) {
              event = triggerEvent(element, 'valid', { cancelable: true });
            }
          } else {
            event = triggerEvent(element, 'invalid', { cancelable: true });
          }

          if (!event || !event.defaultPrevented) {
            Renderer.showWarning(element);
          }

          return valid;
        }

        /**
         * submit a form, because `element` triggered it
         *
         * This method also dispatches a submit event on the form prior to the
         * submission. The event contains the trigger element as `submittedVia`.
         *
         * If the element is a button with a name, the name=value pair will be added
         * to the submitted data.
         */
        function submitFormVia(element) {
          /* apparently, the submit event is not triggered in most browsers on
           * the submit() method, so we do it manually here to model a natural
           * submit as closely as possible.
           * Now to the fun fact: If you trigger a submit event from a form, what
           * do you think should happen?
           * 1) the form will be automagically submitted by the browser, or
           * 2) nothing.
           * And as you already suspected, the correct answer is: both! Firefox
           * opts for 1), Chrome for 2). Yay! */

          var eventGotCancelled;

          var doCancel = function doCancel(e) {
            eventGotCancelled = e.defaultPrevented;
            /* we prevent the default ourselves in this (hopefully) last event
             * handler to keep Firefox from prematurely submitting the form. */
            e.preventDefault();
          };

          element.form.addEventListener('submit', doCancel);
          triggerEvent(element.form, 'submit', { cancelable: true }, { submittedVia: element });
          element.form.removeEventListener('submit', doCancel);

          if (!eventGotCancelled) {
            addSubmitField(element);
            window.HTMLFormElement.prototype.submit.call(element.form);
            window.setTimeout(function () {
              return removeSubmitField(element);
            });
          }
        }

        /**
         * if a submit button was clicked, add its name=value by means of a type=hidden
         * input field
         */
        function addSubmitField(button) {
          if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
            var wrapper = getWrapper(button.form) || {};
            var submitHelper = wrapper.submitHelper;
            if (submitHelper) {
              if (submitHelper.parentNode) {
                submitHelper.parentNode.removeChild(submitHelper);
              }
            } else {
              submitHelper = document.createElement('input');
              submitHelper.type = 'hidden';
              wrapper.submitHelper = submitHelper;
            }
            submitHelper.name = button.name;
            submitHelper.value = button.value;
            button.form.appendChild(submitHelper);
          }
        }

        /**
         * remove a possible helper input, that was added by `addSubmitField`
         */
        function removeSubmitField(button) {
          if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
            var wrapper = getWrapper(button.form) || {};
            var submitHelper = wrapper.submitHelper;
            if (submitHelper && submitHelper.parentNode) {
              submitHelper.parentNode.removeChild(submitHelper);
            }
          }
        }

        /**
         * check a form's validity and submit it
         *
         * The method triggers a cancellable `validate` event on the form. If the
         * event is cancelled, form submission will be aborted, too.
         *
         * If the form is found to contain invalid fields, focus the first field.
         */
        function check(event) {
          /* trigger a "validate" event on the form to be submitted */
          var valEvent = triggerEvent(event.target.form, 'validate', { cancelable: true });
          if (valEvent.defaultPrevented) {
            /* skip the whole submit thing, if the validation is canceled. A user
             * can still call form.submit() afterwards. */
            return;
          }

          var valid = true;
          var firstInvalid;
          Array.prototype.map.call(event.target.form.elements, function (element) {
            if (!reportValidity(element)) {
              valid = false;
              if (!firstInvalid && 'focus' in element) {
                firstInvalid = element;
              }
            }
          });

          if (valid) {
            submitFormVia(event.target);
          } else if (firstInvalid) {
            /* focus the first invalid element, if validation went south */
            firstInvalid.focus();
          }
        }

        /**
         * test if node is a submit button
         */
        function isSubmitButton(node) {
          return (
            /* must be an input or button element... */
            (node.nodeName === 'INPUT' || node.nodeName === 'BUTTON') && (

            /* ...and have a submitting type */
            node.type === 'image' || node.type === 'submit')
          );
        }

        /**
         * test, if the click event would trigger a submit
         */
        function isSubmittingClick(event) {
          return (
            /* prevented default: won't trigger a submit */
            !event.defaultPrevented && (

            /* left button or middle button (submits in Chrome) */
            !('button' in event) || event.button < 2) &&

            /* must be a submit button... */
            isSubmitButton(event.target) &&

            /* the button needs a form, that's going to be submitted */
            event.target.form &&

            /* again, if the form should not be validated, we're out of the game */
            !event.target.form.hasAttribute('novalidate')
          );
        }

        /**
         * test, if the keypress event would trigger a submit
         */
        function isSubmittingKeypress(event) {
          return (
            /* prevented default: won't trigger a submit */
            !event.defaultPrevented && (
            /* ...and <Enter> was pressed... */
            event.keyCode === 13 &&

            /* ...on an <input> that is... */
            event.target.nodeName === 'INPUT' &&

            /* ...a standard text input field (not checkbox, ...) */
            textTypes.indexOf(event.target.type) > -1 ||
            /* or <Enter> or <Space> was pressed... */
            (event.keyCode === 13 || event.keyCode === 32) &&

            /* ...on a submit button */
            isSubmitButton(event.target)) &&

            /* there's a form... */
            event.target.form &&

            /* ...and the form allows validation */
            !event.target.form.hasAttribute('novalidate')
          );
        }

        /**
         * catch explicit submission by click on a button
         */
        function clickHandler(event) {
          if (isSubmittingClick(event)) {
            event.preventDefault();
            if (isSubmitButton(event.target) && event.target.hasAttribute('formnovalidate')) {
              /* if validation should be ignored, we're not interested in any checks */
              submitFormVia(event.target);
            } else {
              check(event);
            }
          }
        }

        /**
         * catch explicit submission by click on a button, but circumvent validation
         */
        function ignoredClickHandler(event) {
          if (isSubmittingClick(event)) {
            event.preventDefault();
            submitFormVia(event.target);
          }
        }

        /**
         * catch implicit submission by pressing <Enter> in some situations
         */
        function keypressHandler(event) {
          if (isSubmittingKeypress(event)) {
            var wrapper = getWrapper(event.target.form) || { settings: {} };
            if (wrapper.settings.preventImplicitSubmit) {
              /* user doesn't want an implicit submit. Cancel here. */
              event.preventDefault();
              return;
            }

            /* check, that there is no submit button in the form. Otherwise
             * that should be clicked. */
            var el = event.target.form.elements.length;
            var submit;
            for (var i = 0; i < el; i++) {
              if (['image', 'submit'].indexOf(event.target.form.elements[i].type) > -1) {
                submit = event.target.form.elements[i];
                break;
              }
            }

            event.preventDefault();
            if (submit) {
              submit.click();
            } else {
              check(event);
            }
          }
        }

        /**
         * catch implicit submission by pressing <Enter> in some situations, but circumvent validation
         */
        function ignoredKeypressHandler(event) {
          if (isSubmittingKeypress(event)) {
            /* check, that there is no submit button in the form. Otherwise
             * that should be clicked. */
            var el = event.target.form.elements.length;
            var submit;
            for (var i = 0; i < el; i++) {
              if (['image', 'submit'].indexOf(event.target.form.elements[i].type) > -1) {
                submit = event.target.form.elements[i];
                break;
              }
            }

            event.preventDefault();
            if (submit) {
              submit.click();
            } else {
              submitFormVia(event.target);
            }
          }
        }

        /**
         * catch all relevant events _prior_ to a form being submitted
         *
         * @param bool ignore bypass validation, when an attempt to submit the
         *                    form is detected.
         */
        function catchSubmit(listeningNode) {
          var ignore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          if (ignore) {
            listeningNode.addEventListener('click', ignoredClickHandler);
            listeningNode.addEventListener('keypress', ignoredKeypressHandler);
          } else {
            listeningNode.addEventListener('click', clickHandler);
            listeningNode.addEventListener('keypress', keypressHandler);
          }
        }

        /**
         * decommission the event listeners from catchSubmit() again
         */
        function uncatchSubmit(listeningNode) {
          listeningNode.removeEventListener('click', ignoredClickHandler);
          listeningNode.removeEventListener('keypress', ignoredKeypressHandler);
          listeningNode.removeEventListener('click', clickHandler);
          listeningNode.removeEventListener('keypress', keypressHandler);
        }

        /**
         * remove `property` from element and restore _original_property, if present
         */

        function uninstallProperty (element, property) {
          delete element[property];

          var originalDescriptor = Object.getOwnPropertyDescriptor(element, '_original_' + property);

          if (originalDescriptor) {
            Object.defineProperty(element, property, originalDescriptor);
          }
        }

        /**
         * add `property` to an element
         *
         * js> installer(element, 'foo', { value: 'bar' });
         * js> assert(element.foo === 'bar');
         */

        function installProperty (element, property, descriptor) {
          descriptor.configurable = true;
          descriptor.enumerable = true;
          if ('value' in descriptor) {
            descriptor.writable = true;
          }

          var originalDescriptor = Object.getOwnPropertyDescriptor(element, property);

          if (originalDescriptor) {

            if (originalDescriptor.configurable === false) {
              /* global console */
              console.log('[hyperform] cannot install custom property ' + property);
              return false;
            }

            /* we already installed that property... */
            if (originalDescriptor.get && originalDescriptor.get.__hyperform || originalDescriptor.value && originalDescriptor.value.__hyperform) {
              return;
            }

            /* publish existing property under new name, if it's not from us */
            Object.defineProperty(element, '_original_' + property, originalDescriptor);
          }

          delete element[property];
          Object.defineProperty(element, property, descriptor);

          return true;
        }

        function isField (element) {
                return element instanceof window.HTMLButtonElement || element instanceof window.HTMLInputElement || element instanceof window.HTMLSelectElement || element instanceof window.HTMLTextAreaElement || element instanceof window.HTMLFieldSetElement || element === window.HTMLButtonElement.prototype || element === window.HTMLInputElement.prototype || element === window.HTMLSelectElement.prototype || element === window.HTMLTextAreaElement.prototype || element === window.HTMLFieldSetElement.prototype;
        }

        /**
         * set a custom validity message or delete it with an empty string
         */
        function setCustomValidity(element, msg) {
          messageStore.set(element, msg, true);
        }

        function sprintf (str) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var argsLength = args.length;
          var globalIndex = 0;

          return str.replace(/%([0-9]+\$)?([sl])/g, function (match, position, type) {
            var localIndex = globalIndex;
            if (position) {
              localIndex = Number(position.replace(/\$$/, '')) - 1;
            }
            globalIndex += 1;

            var arg = '';
            if (argsLength > localIndex) {
              arg = args[localIndex];
            }

            if (arg instanceof Date || typeof arg === 'number' || arg instanceof Number) {
              /* try getting a localized representation of dates and numbers, if the
               * browser supports this */
              if (type === 'l') {
                arg = (arg.toLocaleString || arg.toString).call(arg);
              } else {
                arg = arg.toString();
              }
            }

            return arg;
          });
        }

        /* For a given date, get the ISO week number
         *
         * Source: http://stackoverflow.com/a/6117889/113195
         *
         * Based on information at:
         *
         *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
         *
         * Algorithm is to find nearest thursday, it's year
         * is the year of the week number. Then get weeks
         * between that date and the first day of that year.
         *
         * Note that dates in one year can be weeks of previous
         * or next year, overlap is up to 3 days.
         *
         * e.g. 2014/12/29 is Monday in week  1 of 2015
         *      2012/1/1   is Sunday in week 52 of 2011
         */

        function getWeekOfYear (d) {
          /* Copy date so don't modify original */
          d = new Date(+d);
          d.setUTCHours(0, 0, 0);
          /* Set to nearest Thursday: current date + 4 - current day number
           * Make Sunday's day number 7 */
          d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
          /* Get first day of year */
          var yearStart = new Date(d.getUTCFullYear(), 0, 1);
          /* Calculate full weeks to nearest Thursday */
          var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
          /* Return array of year and week number */
          return [d.getUTCFullYear(), weekNo];
        }

        function pad(num) {
          var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

          var s = num + '';
          while (s.length < size) {
            s = '0' + s;
          }
          return s;
        }

        /**
         * calculate a string from a date according to HTML5
         */
        function dateToString(date, elementType) {
          if (!(date instanceof Date)) {
            return null;
          }

          switch (elementType) {
            case 'datetime':
              return dateToString(date, 'date') + 'T' + dateToString(date, 'time');

            case 'datetime-local':
              return sprintf('%s-%s-%sT%s:%s:%s.%s', date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()), pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds()), pad(date.getMilliseconds(), 3)).replace(/(:00)?\.000$/, '');

            case 'date':
              return sprintf('%s-%s-%s', date.getUTCFullYear(), pad(date.getUTCMonth() + 1), pad(date.getUTCDate()));

            case 'month':
              return sprintf('%s-%s', date.getUTCFullYear(), pad(date.getUTCMonth() + 1));

            case 'week':
              var params = getWeekOfYear(date);
              return sprintf.call(null, '%s-W%s', params[0], pad(params[1]));

            case 'time':
              return sprintf('%s:%s:%s.%s', pad(date.getUTCHours()), pad(date.getUTCMinutes()), pad(date.getUTCSeconds()), pad(date.getUTCMilliseconds(), 3)).replace(/(:00)?\.000$/, '');
          }

          return null;
        }

        /**
         * return a new Date() representing the ISO date for a week number
         *
         * @see http://stackoverflow.com/a/16591175/113195
         */

        function getDateFromWeek (week, year) {
          var date = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));

          if (date.getUTCDay() <= 4 /* thursday */) {
              date.setUTCDate(date.getUTCDate() - date.getUTCDay() + 1);
            } else {
            date.setUTCDate(date.getUTCDate() + 8 - date.getUTCDay());
          }

          return date;
        }

        /**
         * calculate a date from a string according to HTML5
         */
        function stringToDate (string, elementType) {
          var date = new Date(0);
          var ms;
          switch (elementType) {
            case 'datetime':
              if (!/^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
                return null;
              }
              ms = RegExp.$7 || '000';
              while (ms.length < 3) {
                ms += '0';
              }
              date.setUTCFullYear(Number(RegExp.$1));
              date.setUTCMonth(Number(RegExp.$2) - 1, Number(RegExp.$3));
              date.setUTCHours(Number(RegExp.$4), Number(RegExp.$5), Number(RegExp.$6 || 0), Number(ms));
              return date;

            case 'date':
              if (!/^([0-9]{4,})-([0-9]{2})-([0-9]{2})$/.test(string)) {
                return null;
              }
              date.setUTCFullYear(Number(RegExp.$1));
              date.setUTCMonth(Number(RegExp.$2) - 1, Number(RegExp.$3));
              return date;

            case 'month':
              if (!/^([0-9]{4,})-([0-9]{2})$/.test(string)) {
                return null;
              }
              date.setUTCFullYear(Number(RegExp.$1));
              date.setUTCMonth(Number(RegExp.$2) - 1, 1);
              return date;

            case 'week':
              if (!/^([0-9]{4,})-W(0[1-9]|[1234][0-9]|5[0-3])$/.test(string)) {
                return null;
              }
              return getDateFromWeek(Number(RegExp.$2), Number(RegExp.$1));

            case 'time':
              if (!/^([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(string)) {
                return null;
              }
              ms = RegExp.$4 || '000';
              while (ms.length < 3) {
                ms += '0';
              }
              date.setUTCHours(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3 || 0), Number(ms));
              return date;
          }

          return null;
        }

        /**
         * calculate a date from a string according to HTML5
         */
        function stringToNumber (string, elementType) {
          var rval = stringToDate(string, elementType);
          if (rval !== null) {
            return +rval;
          }
          /* not parseFloat, because we want NaN for invalid values like "1.2xxy" */
          return Number(string);
        }

        /**
         * get the element's type in a backwards-compatible way
         */
        function getType (element) {
          if (element instanceof window.HTMLTextAreaElement) {
            return 'textarea';
          } else if (element instanceof window.HTMLSelectElement) {
            return element.hasAttribute('multiple') ? 'select-multiple' : 'select-one';
          } else if (element instanceof window.HTMLButtonElement) {
            return (element.getAttribute('type') || 'submit').toLowerCase();
          } else if (element instanceof window.HTMLInputElement) {
            var attr = (element.getAttribute('type') || '').toLowerCase();
            if (attr && inputs.indexOf(attr) > -1) {
              return attr;
            } else {
              /* perhaps the DOM has in-depth knowledge. Take that before returning
               * 'text'. */
              return element.type || 'text';
            }
          }

          return '';
        }

        /**
         * the following validation messages are from Firefox source,
         * http://mxr.mozilla.org/mozilla-central/source/dom/locales/en-US/chrome/dom/dom.properties
         * released under MPL license, http://mozilla.org/MPL/2.0/.
         */

        var catalog = {
          en: {
            TextTooLong: 'Please shorten this text to %l characters or less (you are currently using %l characters).',
            ValueMissing: 'Please fill out this field.',
            CheckboxMissing: 'Please check this box if you want to proceed.',
            RadioMissing: 'Please select one of these options.',
            FileMissing: 'Please select a file.',
            SelectMissing: 'Please select an item in the list.',
            InvalidEmail: 'Please enter an email address.',
            InvalidURL: 'Please enter a URL.',
            PatternMismatch: 'Please match the requested format.',
            PatternMismatchWithTitle: 'Please match the requested format: %l.',
            NumberRangeOverflow: 'Please select a value that is no more than %l.',
            DateRangeOverflow: 'Please select a value that is no later than %l.',
            TimeRangeOverflow: 'Please select a value that is no later than %l.',
            NumberRangeUnderflow: 'Please select a value that is no less than %l.',
            DateRangeUnderflow: 'Please select a value that is no earlier than %l.',
            TimeRangeUnderflow: 'Please select a value that is no earlier than %l.',
            StepMismatch: 'Please select a valid value. The two nearest valid values are %l and %l.',
            StepMismatchOneValue: 'Please select a valid value. The nearest valid value is %l.',
            BadInputNumber: 'Please enter a number.'
          }
        };

        var language = 'en';

        function setLanguage(newlang) {
          language = newlang;
        }

        function addTranslation(lang, newCatalog) {
          if (!(lang in catalog)) {
            catalog[lang] = {};
          }
          for (var key in newCatalog) {
            if (newCatalog.hasOwnProperty(key)) {
              catalog[lang][key] = newCatalog[key];
            }
          }
        }

        function l10n (s) {
          if (language in catalog && s in catalog[language]) {
            return catalog[language][s];
          } else if (s in catalog.en) {
            return catalog.en[s];
          }
          return s;
        }

        var defaultStep = {
          'datetime-local': 60,
          datetime: 60,
          time: 60
        };

        var stepScaleFactor = {
          'datetime-local': 1000,
          datetime: 1000,
          date: 86400000,
          week: 604800000,
          time: 1000
        };

        var defaultStepBase = {
          week: -259200000
        };

        var defaultMin = {
          range: 0
        };

        var defaultMax = {
          range: 100
        };

        /**
         * get previous and next valid values for a stepped input element
         */
        function getNextValid (element) {
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

          var type = getType(element);

          var aMin = element.getAttribute('min');
          var min = defaultMin[type] || NaN;
          if (aMin) {
            var pMin = stringToNumber(aMin, type);
            if (!isNaN(pMin)) {
              min = pMin;
            }
          }

          var aMax = element.getAttribute('max');
          var max = defaultMax[type] || NaN;
          if (aMax) {
            var pMax = stringToNumber(aMax, type);
            if (!isNaN(pMax)) {
              max = pMax;
            }
          }

          var aStep = element.getAttribute('step');
          var step = defaultStep[type] || 1;
          if (aStep && aStep.toLowerCase() === 'any') {
            /* quick return: we cannot calculate prev and next */
            return [l10n('any value'), l10n('any value')];
          } else if (aStep) {
            var pStep = stringToNumber(aStep, type);
            if (!isNaN(pStep)) {
              step = pStep;
            }
          }

          var defaultValue = stringToNumber(element.getAttribute('value'), type);

          var value = stringToNumber(element.value || element.getAttribute('value'), type);

          if (isNaN(value)) {
            /* quick return: we cannot calculate without a solid base */
            return [l10n('any valid value'), l10n('any valid value')];
          }

          var stepBase = !isNaN(min) ? min : !isNaN(defaultValue) ? defaultValue : defaultStepBase[type] || 0;

          var scale = stepScaleFactor[type] || 1;

          var prev = stepBase + Math.floor((value - stepBase) / (step * scale)) * (step * scale) * n;
          var next = stepBase + (Math.floor((value - stepBase) / (step * scale)) + 1) * (step * scale) * n;

          if (prev < min) {
            prev = null;
          } else if (prev > max) {
            prev = max;
          }

          if (next > max) {
            next = null;
          } else if (next < min) {
            next = min;
          }

          /* convert to date objects, if appropriate */
          if (dates.indexOf(type) > -1) {
            prev = dateToString(new Date(prev), type);
            next = dateToString(new Date(next), type);
          }

          return [prev, next];
        }

        /**
         * implement the valueAsDate functionality
         *
         * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasdate
         */
        function valueAsDate(element) {
          var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          var type = getType(element);
          if (dates.indexOf(type) > -1) {
            if (value !== undefined) {
              /* setter: value must be null or a Date() */
              if (value === null) {
                element.value = '';
              } else if (value instanceof Date) {
                if (isNaN(value.getTime())) {
                  element.value = '';
                } else {
                  element.value = dateToString(value, type);
                }
              } else {
                throw new window.DOMException('valueAsDate setter encountered invalid value', 'TypeError');
              }
              return;
            }

            var valueDate = stringToDate(element.value, type);
            return valueDate instanceof Date ? valueDate : null;
          } else if (value !== undefined) {
            /* trying to set a date on a not-date input fails */
            throw new window.DOMException('valueAsDate setter cannot set date on this element', 'InvalidStateError');
          }

          return null;
        }

        /**
         * implement the valueAsNumber functionality
         *
         * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasnumber
         */
        function valueAsNumber(element) {
          var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          var type = getType(element);
          if (numbers.indexOf(type) > -1) {
            if (type === 'range' && element.hasAttribute('multiple')) {
              /* @see https://html.spec.whatwg.org/multipage/forms.html#do-not-apply */
              return NaN;
            }

            if (value !== undefined) {
              /* setter: value must be NaN or a finite number */
              if (isNaN(value)) {
                element.value = '';
              } else if (typeof value === 'number' && window.isFinite(value)) {
                try {
                  /* try setting as a date, but... */
                  valueAsDate(element, new Date(value));
                } catch (e) {
                  /* ... when valueAsDate is not responsible, ... */
                  if (!(e instanceof window.DOMException)) {
                    throw e;
                  }
                  /* ... set it via Number.toString(). */
                  element.value = value.toString();
                }
              } else {
                throw new window.DOMException('valueAsNumber setter encountered invalid value', 'TypeError');
              }
              return;
            }

            return stringToNumber(element.value, type);
          } else if (value !== undefined) {
            /* trying to set a number on a not-number input fails */
            throw new window.DOMException('valueAsNumber setter cannot set number on this element', 'InvalidStateError');
          }

          return NaN;
        }

        /**
         *
         */
        function stepDown(element) {
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

          if (numbers.indexOf(getType(element)) === -1) {
            throw new window.DOMException('stepDown encountered invalid type', 'InvalidStateError');
          }
          if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
            throw new window.DOMException('stepDown encountered step "any"', 'InvalidStateError');
          }

          var prev = getNextValid(element, n)[0];

          if (prev !== null) {
            valueAsNumber(element, prev);
          }
        }

        /**
         *
         */
        function stepUp(element) {
          var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

          if (numbers.indexOf(getType(element)) === -1) {
            throw new window.DOMException('stepUp encountered invalid type', 'InvalidStateError');
          }
          if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
            throw new window.DOMException('stepUp encountered step "any"', 'InvalidStateError');
          }

          var next = getNextValid(element, n)[1];

          if (next !== null) {
            valueAsNumber(element, next);
          }
        }

        /**
         * get the validation message for an element, empty string, if the element
         * satisfies all constraints.
         */
        function validationMessage(element) {
          var msg = messageStore.get(element);
          if (!msg) {
            return '';
          }

          /* make it a primitive again, since messageStore returns String(). */
          return msg.toString();
        }

        /**
         * check, if an element will be subject to HTML5 validation at all
         */
        function willValidate(element) {
          return isValidationCandidate(element);
        }

        var gA = function gA(prop) {
          return function () {
            return doFilter('attr_get_' + prop, this.getAttribute(prop), this);
          };
        };

        var sA = function sA(prop) {
          return function (value) {
            this.setAttribute(prop, doFilter('attr_set_' + prop, value, this));
          };
        };

        var gAb = function gAb(prop) {
          return function () {
            return doFilter('attr_get_' + prop, this.hasAttribute(prop), this);
          };
        };

        var sAb = function sAb(prop) {
          return function (value) {
            if (doFilter('attr_set_' + prop, value, this)) {
              this.setAttribute(prop, prop);
            } else {
              this.removeAttribute(prop);
            }
          };
        };

        var gAn = function gAn(prop) {
          return function () {
            return doFilter('attr_get_' + prop, Math.max(0, Number(this.getAttribute(prop))), this);
          };
        };

        var sAn = function sAn(prop) {
          return function (value) {
            value = doFilter('attr_set_' + prop, value, this);
            if (/^[0-9]+$/.test(value)) {
              this.setAttribute(prop, value);
            }
          };
        };

        function installProperties(element) {
          var _arr = ['accept', 'max', 'min', 'pattern', 'placeholder', 'step'];

          for (var _i = 0; _i < _arr.length; _i++) {
            var prop = _arr[_i];
            installProperty(element, prop, {
              get: gA(prop),
              set: sA(prop)
            });
          }

          var _arr2 = ['multiple', 'required', 'readOnly'];
          for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
            var _prop = _arr2[_i2];
            installProperty(element, _prop, {
              get: gAb(_prop.toLowerCase()),
              set: sAb(_prop.toLowerCase())
            });
          }

          var _arr3 = ['minLength', 'maxLength'];
          for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
            var _prop2 = _arr3[_i3];
            installProperty(element, _prop2, {
              get: gAn(_prop2.toLowerCase()),
              set: sAn(_prop2.toLowerCase())
            });
          }
        }

        function uninstallProperties(element) {
          var _arr4 = ['accept', 'max', 'min', 'pattern', 'placeholder', 'step', 'multiple', 'required', 'readOnly', 'minLength', 'maxLength'];

          for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
            var prop = _arr4[_i4];
            uninstallProperty(element, prop);
          }
        }

        var polyfills = {
          checkValidity: {
            value: mark(function () {
              return checkValidity(this);
            })
          },
          reportValidity: {
            value: mark(function () {
              return reportValidity(this);
            })
          },
          setCustomValidity: {
            value: mark(function (msg) {
              return setCustomValidity(this, msg);
            })
          },
          stepDown: {
            value: mark(function () {
              var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
              return stepDown(this, n);
            })
          },
          stepUp: {
            value: mark(function () {
              var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
              return stepUp(this, n);
            })
          },
          validationMessage: {
            get: mark(function () {
              return validationMessage(this);
            })
          },
          validity: {
            get: mark(function () {
              return ValidityState(this);
            })
          },
          valueAsDate: {
            get: mark(function () {
              return valueAsDate(this);
            }),
            set: mark(function (value) {
              valueAsDate(this, value);
            })
          },
          valueAsNumber: {
            get: mark(function () {
              return valueAsNumber(this);
            }),
            set: mark(function (value) {
              valueAsNumber(this, value);
            })
          },
          willValidate: {
            get: mark(function () {
              return willValidate(this);
            })
          }
        };

        function polyfill (element) {
          if (isField(element)) {

            for (var prop in polyfills) {
              installProperty(element, prop, polyfills[prop]);
            }

            installProperties(element);
          } else if (element instanceof window.HTMLFormElement || element === window.HTMLFormElement.prototype) {
            installProperty(element, 'checkValidity', polyfills.checkValidity);
            installProperty(element, 'reportValidity', polyfills.reportValidity);
          }
        }

        function polyunfill (element) {
          if (isField(element)) {

            uninstallProperty(element, 'checkValidity');
            uninstallProperty(element, 'reportValidity');
            uninstallProperty(element, 'setCustomValidity');
            uninstallProperty(element, 'stepDown');
            uninstallProperty(element, 'stepUp');
            uninstallProperty(element, 'validationMessage');
            uninstallProperty(element, 'validity');
            uninstallProperty(element, 'valueAsDate');
            uninstallProperty(element, 'valueAsNumber');
            uninstallProperty(element, 'willValidate');

            uninstallProperties(element);
          } else if (element instanceof window.HTMLFormElement) {
            uninstallProperty(element, 'checkValidity');
            uninstallProperty(element, 'reportValidity');
          }
        }

        var instances = new WeakMap();

        /**
         * wrap <form>s, window or document, that get treated with the global
         * hyperform()
         */
        function Wrapper(form, settings) {

          /* do not allow more than one instance per form. Otherwise we'd end
           * up with double event handlers, polyfills re-applied, ... */
          var existing = instances.get(form);
          if (existing) {
            existing.settings = settings;
            return existing;
          }

          this.form = form;
          this.settings = settings;
          this.revalidator = this.revalidate.bind(this);

          instances.set(form, this);

          catchSubmit(form, settings.revalidate === 'never');

          if (form === window || form instanceof window.HTMLDocument) {
            /* install on the prototypes, when called for the whole document */
            this.install([window.HTMLButtonElement.prototype, window.HTMLInputElement.prototype, window.HTMLSelectElement.prototype, window.HTMLTextAreaElement.prototype, window.HTMLFieldSetElement.prototype]);
            polyfill(window.HTMLFormElement);
          } else if (form instanceof window.HTMLFormElement || form instanceof window.HTMLFieldSetElement) {
            this.install(form.elements);
            if (form instanceof window.HTMLFormElement) {
              polyfill(form);
            }
          }

          if (settings.revalidate === 'oninput' || settings.revalidate === 'hybrid') {
            /* in a perfect world we'd just bind to "input", but support here is
              * abysmal: http://caniuse.com/#feat=input-event */
            form.addEventListener('keyup', this.revalidator);
            form.addEventListener('change', this.revalidator);
          }
          if (settings.revalidate === 'onblur' || settings.revalidate === 'hybrid') {
            /* useCapture=true, because `blur` doesn't bubble. See
              * https://developer.mozilla.org/en-US/docs/Web/Events/blur#Event_delegation
              * for a discussion */
            form.addEventListener('blur', this.revalidator, true);
          }
        }

        Wrapper.prototype = {
          destroy: function destroy() {
            uncatchSubmit(this.form);
            instances.delete(this.form);
            this.form.removeEventListener('keyup', this.revalidator);
            this.form.removeEventListener('change', this.revalidator);
            this.form.removeEventListener('blur', this.revalidator, true);
            if (this.form === window || this.form instanceof window.HTMLDocument) {
              this.uninstall([window.HTMLButtonElement.prototype, window.HTMLInputElement.prototype, window.HTMLSelectElement.prototype, window.HTMLTextAreaElement.prototype, window.HTMLFieldSetElement.prototype]);
              polyunfill(window.HTMLFormElement);
            } else if (this.form instanceof window.HTMLFormElement || this.form instanceof window.HTMLFieldSetElement) {
              this.uninstall(this.form.elements);
              if (this.form instanceof window.HTMLFormElement) {
                polyunfill(this.form);
              }
            }
          },


          /**
           * revalidate an input element
           */
          revalidate: function revalidate(event) {
            if (event.target instanceof window.HTMLButtonElement || event.target instanceof window.HTMLTextAreaElement || event.target instanceof window.HTMLSelectElement || event.target instanceof window.HTMLInputElement) {

              if (this.settings.revalidate === 'hybrid') {
                /* "hybrid" somewhat simulates what browsers do. See for example
                 * Firefox's :-moz-ui-invalid pseudo-class:
                 * https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-ui-invalid */
                if (event.type === 'blur' && event.target.value !== event.target.defaultValue || ValidityState(event.target).valid) {
                  /* on blur, update the report when the value has changed from the
                   * default or when the element is valid (possibly removing a still
                   * standing invalidity report). */
                  reportValidity(event.target);
                } else if (event.type === 'keyup' || event.type === 'change') {
                  if (ValidityState(event.target).valid) {
                    // report instantly, when an element becomes valid,
                    // postpone report to blur event, when an element is invalid
                    reportValidity(event.target);
                  }
                }
              } else {
                reportValidity(event.target);
              }
            }
          },


          /**
           * install the polyfills on each given element
           *
           * If you add elements dynamically, you have to call install() on them
           * yourself:
           *
           * js> var form = hyperform(document.forms[0]);
           * js> document.forms[0].appendChild(input);
           * js> form.install(input);
           *
           * You can skip this, if you called hyperform on window or document.
           */
          install: function install(els) {
            if (els instanceof window.Element) {
              els = [els];
            }

            var elsLength = els.length;

            for (var i = 0; i < elsLength; i++) {
              polyfill(els[i]);
            }
          },
          uninstall: function uninstall(els) {
            if (els instanceof window.Element) {
              els = [els];
            }

            var elsLength = els.length;

            for (var i = 0; i < elsLength; i++) {
              polyunfill(els[i]);
            }
          }
        };

        /**
         * try to get the appropriate wrapper for a specific element by looking up
         * its parent chain
         *
         * @return Wrapper | undefined
         */
        function getWrapper(element) {
          var wrapped;

          if (element.form) {
            /* try a shortcut with the element's <form> */
            wrapped = instances.get(element.form);
          }

          /* walk up the parent nodes until document (including) */
          while (!wrapped && element) {
            wrapped = instances.get(element);
            element = element.parentNode;
          }

          if (!wrapped) {
            /* try the global instance, if exists. This may also be undefined. */
            wrapped = instances.get(window);
          }

          return wrapped;
        }

        /**
         * check if an element is a candidate for constraint validation
         *
         * @see https://html.spec.whatwg.org/multipage/forms.html#barred-from-constraint-validation
         */
        function isValidationCandidate (element) {
          /* it must be any of those elements */
          if (element instanceof window.HTMLSelectElement || element instanceof window.HTMLTextAreaElement || element instanceof window.HTMLButtonElement || element instanceof window.HTMLInputElement) {

            var type = getType(element);
            /* its type must be in the whitelist or missing (select, textarea) */
            if (!type || nonInputs.indexOf(type) > -1 || validationCandidates.indexOf(type) > -1) {

              /* it mustn't be disabled or readonly */
              if (!element.hasAttribute('disabled') && !element.hasAttribute('readonly')) {

                var wrappedForm = getWrapper(element);
                /* it hasn't got the (non-standard) attribute 'novalidate' or its
                 * parent form has got the strict parameter */
                if (wrappedForm && wrappedForm.settings.novalidateOnElements || !element.hasAttribute('novalidate') || !element.noValidate) {

                  /* it isn't part of a <fieldset disabled> */
                  var p = element.parentNode;
                  while (p && p.nodeType === 1) {
                    if (p instanceof window.HTMLFieldSetElement && p.hasAttribute('disabled')) {
                      /* quick return, if it's a child of a disabled fieldset */
                      return false;
                    } else if (p.nodeName.toUpperCase() === 'DATALIST') {
                      /* quick return, if it's a child of a datalist
                       * Do not use HTMLDataListElement to support older browsers,
                       * too.
                       * @see https://html.spec.whatwg.org/multipage/forms.html#the-datalist-element:barred-from-constraint-validation
                       */
                      return false;
                    } else if (p === element.form) {
                      /* the outer boundary. We can stop looking for relevant
                       * fieldsets. */
                      break;
                    }
                    p = p.parentNode;
                  }

                  /* then it's a candidate */
                  return true;
                }
              }
            }
          }

          /* this is no HTML5 validation candidate... */
          return false;
        }

        function formatDate (date) {
          var part = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

          switch (part) {
            case 'date':
              return (date.toLocaleDateString || date.toDateString).call(date);
            case 'time':
              return (date.toLocaleTimeString || date.toTimeString).call(date);
            case 'month':
              return 'toLocaleDateString' in date ? date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit'
              }) : date.toDateString();
            // case 'week':
            // TODO
            default:
              return (date.toLocaleString || date.toString).call(date);
          }
        }

        /**
         * patch String.length to account for non-BMP characters
         *
         * @see https://mathiasbynens.be/notes/javascript-unicode
         * We do not use the simple [...str].length, because it needs a ton of
         * polyfills in older browsers.
         */

        function unicodeStringLength (str) {
          return str.match(/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g).length;
        }

        /**
         * internal storage for custom error messages
         */

        var store$1 = new WeakMap();

        /**
         * register custom error messages per element
         */
        var customMessages = {
          set: function set(element, validator, message) {
            var messages = store$1.get(element) || {};
            messages[validator] = message;
            store$1.set(element, messages);
            return customMessages;
          },
          get: function get(element, validator) {
            var _default = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

            var messages = store$1.get(element);
            if (messages === undefined || !(validator in messages)) {
              var dataId = 'data-' + validator.replace(/[A-Z]/g, '-$&').toLowerCase();
              if (element.hasAttribute(dataId)) {
                /* if the element has a data-validator attribute, use this as fallback.
                 * E.g., if validator == 'valueMissing', the element can specify a
                 * custom validation message like this:
                 *     <input data-value-missing="Oh noes!">
                 */
                return element.getAttribute(dataId);
              }
              return _default;
            }
            return messages[validator];
          },
          delete: function _delete(element) {
            var validator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            if (!validator) {
              return store$1.delete(element);
            }
            var messages = store$1.get(element) || {};
            if (validator in messages) {
              delete messages[validator];
              store$1.set(element, messages);
              return true;
            }
            return false;
          }
        };

        var internalRegistry = new WeakMap();

        /**
         * A registry for custom validators
         *
         * slim wrapper around a WeakMap to ensure the values are arrays
         * (hence allowing > 1 validators per element)
         */
        var customValidatorRegistry = {
          set: function set(element, validator) {
            var current = internalRegistry.get(element) || [];
            current.push(validator);
            internalRegistry.set(element, current);
            return customValidatorRegistry;
          },
          get: function get(element) {
            return internalRegistry.get(element) || [];
          },
          delete: function _delete(element) {
            return internalRegistry.delete(element);
          }
        };

        /**
         * test whether the element suffers from bad input
         */
        function testBadInput (element) {
          var type = getType(element);

          if (!isValidationCandidate(element) || inputChecked.indexOf(type) === -1) {
            /* we're not interested, thanks! */
            return true;
          }

          /* the browser hides some bad input from the DOM, e.g. malformed numbers,
           * email addresses with invalid punycode representation, ... We try to resort
           * to the original method here. The assumption is, that a browser hiding
           * bad input will hopefully also always support a proper
           * ValidityState.badInput */
          if (!element.value) {
            if ('_original_validity' in element && !element._original_validity.__hyperform) {
              return !element._original_validity.badInput;
            }
            /* no value and no original badInput: Assume all's right. */
            return true;
          }

          var result = true;
          switch (type) {
            case 'color':
              result = /^#[a-f0-9]{6}$/.test(element.value);
              break;
            case 'number':
            case 'range':
              result = !isNaN(Number(element.value));
              break;
            case 'datetime':
            case 'date':
            case 'month':
            case 'week':
            case 'time':
              result = stringToDate(element.value, type) !== null;
              break;
            case 'datetime-local':
              result = /^([0-9]{4,})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9])(?:\.([0-9]{1,3}))?)?$/.test(element.value);
              break;
            case 'tel':
              /* spec says No! Phone numbers can have all kinds of formats, so this
               * is expected to be a free-text field. */
              // TODO we could allow a setting 'phoneRegex' to be evaluated here.
              break;
            case 'email':
              break;
          }

          return result;
        }

        /**
         * test the max attribute
         *
         * we use Number() instead of parseFloat(), because an invalid attribute
         * value like "123abc" should result in an error.
         */
        function testMax (element) {
          var type = getType(element);

          if (!isValidationCandidate(element) || !element.value || !element.hasAttribute('max')) {
            /* we're not responsible here */
            return true;
          }

          var value = void 0,
              max = void 0;
          if (dates.indexOf(type) > -1) {
            value = 1 * stringToDate(element.value, type);
            max = 1 * (stringToDate(element.getAttribute('max'), type) || NaN);
          } else {
            value = Number(element.value);
            max = Number(element.getAttribute('max'));
          }

          return isNaN(max) || value <= max;
        }

        /**
         * test the maxlength attribute
         */
        function testMaxlength (element) {
          if (!isValidationCandidate(element) || !element.value || textTypes.indexOf(getType(element)) === -1 || !element.hasAttribute('maxlength') || !element.getAttribute('maxlength') // catch maxlength=""
          ) {
              return true;
            }

          var maxlength = parseInt(element.getAttribute('maxlength'), 10);

          /* check, if the maxlength value is usable at all.
           * We allow maxlength === 0 to basically disable input (Firefox does, too).
           */
          if (isNaN(maxlength) || maxlength < 0) {
            return true;
          }

          return unicodeStringLength(element.value) <= maxlength;
        }

        /**
         * test the min attribute
         *
         * we use Number() instead of parseFloat(), because an invalid attribute
         * value like "123abc" should result in an error.
         */
        function testMin (element) {
          var type = getType(element);

          if (!isValidationCandidate(element) || !element.value || !element.hasAttribute('min')) {
            /* we're not responsible here */
            return true;
          }

          var value = void 0,
              min = void 0;
          if (dates.indexOf(type) > -1) {
            value = 1 * stringToDate(element.value, type);
            min = 1 * (stringToDate(element.getAttribute('min'), type) || NaN);
          } else {
            value = Number(element.value);
            min = Number(element.getAttribute('min'));
          }

          return isNaN(min) || value >= min;
        }

        /**
         * test the minlength attribute
         */
        function testMinlength (element) {
          if (!isValidationCandidate(element) || !element.value || textTypes.indexOf(getType(element)) === -1 || !element.hasAttribute('minlength') || !element.getAttribute('minlength') // catch minlength=""
          ) {
              return true;
            }

          var minlength = parseInt(element.getAttribute('minlength'), 10);

          /* check, if the minlength value is usable at all. */
          if (isNaN(minlength) || minlength < 0) {
            return true;
          }

          return unicodeStringLength(element.value) >= minlength;
        }

        /**
         * test the pattern attribute
         */
        function testPattern (element) {
            return !isValidationCandidate(element) || !element.value || !element.hasAttribute('pattern') || new RegExp('^(?:' + element.getAttribute('pattern') + ')$').test(element.value);
        }

        /**
         * test the required attribute
         */
        function testRequired (element) {
          if (!isValidationCandidate(element) || !element.hasAttribute('required')) {
            /* nothing to do */
            return true;
          }

          /* we don't need getType() for element.type, because "checkbox" and "radio"
           * are well supported. */
          switch (element.type) {
            case 'checkbox':
              return element.checked;
            //break;
            case 'radio':
              /* radio inputs have "required" fulfilled, if _any_ other radio
               * with the same name in this form is checked. */
              return !!(element.checked || element.form && Array.prototype.filter.call(document.getElementsByName(element.name), function (radio) {
                return radio.name === element.name && radio.form === element.form && radio.checked;
              }).length > 0);
            //break;
            default:
              return !!element.value;
          }
        }

        /**
         * test the step attribute
         */
        function testStep (element) {
          var type = getType(element);

          if (!isValidationCandidate(element) || !element.value || numbers.indexOf(type) === -1 || (element.getAttribute('step') || '').toLowerCase() === 'any') {
            /* we're not responsible here. Note: If no step attribute is given, we
             * need to validate against the default step as per spec. */
            return true;
          }

          var step = element.getAttribute('step');
          if (step) {
            step = stringToNumber(step, type);
          } else {
            step = defaultStep[type] || 1;
          }

          if (step <= 0 || isNaN(step)) {
            /* error in specified "step". We cannot validate against it, so the value
             * is true. */
            return true;
          }

          var scale = stepScaleFactor[type] || 1;

          var value = stringToNumber(element.value, type);
          var min = stringToNumber(element.getAttribute('min') || element.getAttribute('value') || '', type);

          if (isNaN(min)) {
            min = defaultStepBase[type] || 0;
          }

          if (type === 'month') {
            /* type=month has month-wide steps. See
             * https://html.spec.whatwg.org/multipage/forms.html#month-state-%28type=month%29
             */
            min = new Date(min).getUTCFullYear() * 12 + new Date(min).getUTCMonth();
            value = new Date(value).getUTCFullYear() * 12 + new Date(value).getUTCMonth();
          }

          var result = Math.abs(min - value) % (step * scale);

          return result < 0.00000001 ||
          /* crappy floating-point arithmetics! */
          result > step * scale - 0.00000001;
        }

        var wsOnStartOrEnd = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

        /**
         * trim a string of whitespace
         *
         * We don't use String.trim() to remove the need to polyfill it.
         */
        function trim (str) {
          return str.replace(wsOnStartOrEnd, '');
        }

        /**
         * split a string on comma and trim the components
         *
         * As specified at
         * https://html.spec.whatwg.org/multipage/infrastructure.html#split-a-string-on-commas
         * plus removing empty entries.
         */
        function commaSplit (str) {
          return str.split(',').map(function (item) {
            return trim(item);
          }).filter(function (b) {
            return b;
          });
        }

        /* we use a dummy <a> where we set the href to test URL validity
         * The definition is out of the "global" scope so that JSDOM can be instantiated
         * after loading Hyperform for tests.
         */
        var urlCanary;

        /* see https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address */
        var emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        /**
         * test the type-inherent syntax
         */
        function testType (element) {
          var type = getType(element);

          if (!isValidationCandidate(element) || type !== 'file' && !element.value || type !== 'file' && typeChecked.indexOf(type) === -1) {
            /* we're not responsible for this element */
            return true;
          }

          var isValid = true;

          switch (type) {
            case 'url':
              if (!urlCanary) {
                urlCanary = document.createElement('a');
              }
              var value = trim(element.value);
              urlCanary.href = value;
              isValid = urlCanary.href === value || urlCanary.href === value + '/';
              break;
            case 'email':
              if (element.hasAttribute('multiple')) {
                isValid = commaSplit(element.value).every(function (value) {
                  return emailPattern.test(value);
                });
              } else {
                isValid = emailPattern.test(trim(element.value));
              }
              break;
            case 'file':
              if ('files' in element && element.files.length && element.hasAttribute('accept')) {
                var patterns = commaSplit(element.getAttribute('accept')).map(function (pattern) {
                  if (/^(audio|video|image)\/\*$/.test(pattern)) {
                    pattern = new RegExp('^' + RegExp.$1 + '/.+$');
                  }
                  return pattern;
                });

                if (!patterns.length) {
                  break;
                }

                fileloop: for (var i = 0; i < element.files.length; i++) {
                  /* we need to match a whitelist, so pre-set with false */
                  var fileValid = false;

                  patternloop: for (var j = 0; j < patterns.length; j++) {
                    var file = element.files[i];
                    var pattern = patterns[j];

                    var fileprop = file.type;

                    if (typeof pattern === 'string' && pattern.substr(0, 1) === '.') {
                      if (file.name.search('.') === -1) {
                        /* no match with any file ending */
                        continue patternloop;
                      }

                      fileprop = file.name.substr(file.name.lastIndexOf('.'));
                    }

                    if (fileprop.search(pattern) === 0) {
                      /* we found one match and can quit looking */
                      fileValid = true;
                      break patternloop;
                    }
                  }

                  if (!fileValid) {
                    isValid = false;
                    break fileloop;
                  }
                }
              }
          }

          return isValid;
        }

        /**
         * boilerplate function for all tests but customError
         */
        function check$1(test, react) {
          return function (element) {
            var invalid = !test(element);
            if (invalid) {
              react(element);
            }
            return invalid;
          };
        }

        /**
         * create a common function to set error messages
         */
        function setMsg(element, msgtype, _default) {
          messageStore.set(element, customMessages.get(element, msgtype, _default));
        }

        var badInput = check$1(testBadInput, function (element) {
          return setMsg(element, 'badInput', l10n('Please match the requested type.'));
        });

        function customError(element) {
          /* check, if there are custom validators in the registry, and call
           * them. */
          var customValidators = customValidatorRegistry.get(element);
          var cvl = customValidators.length;
          var valid = true;

          if (cvl) {
            for (var i = 0; i < cvl; i++) {
              var result = customValidators[i](element);
              if (result !== undefined && !result) {
                valid = false;
                /* break on first invalid response */
                break;
              }
            }
          }

          /* check, if there are other validity messages already */
          if (valid) {
            var msg = messageStore.get(element);
            valid = !(msg.toString() && 'isCustom' in msg);
          }

          return !valid;
        }

        var patternMismatch = check$1(testPattern, function (element) {
          setMsg(element, 'patternMismatch', element.title ? sprintf(l10n('PatternMismatchWithTitle'), element.title) : l10n('PatternMismatch'));
        });

        var rangeOverflow = check$1(testMax, function (element) {
          var type = getType(element);
          var msg = void 0;
          switch (type) {
            case 'date':
            case 'datetime':
            case 'datetime-local':
              msg = sprintf(l10n('DateRangeOverflow'), formatDate(stringToDate(element.getAttribute('max'), type), type));
              break;
            case 'time':
              msg = sprintf(l10n('TimeRangeOverflow'), formatDate(stringToDate(element.getAttribute('max'), type), type));
              break;
            // case 'number':
            default:
              msg = sprintf(l10n('NumberRangeOverflow'), stringToNumber(element.getAttribute('max'), type));
              break;
          }
          setMsg(element, 'rangeOverflow', msg);
        });

        var rangeUnderflow = check$1(testMin, function (element) {
          var type = getType(element);

          var msg = void 0;
          switch (type) {
            case 'date':
            case 'datetime':
            case 'datetime-local':
              msg = sprintf(l10n('DateRangeUnderflow'), formatDate(stringToDate(element.getAttribute('min'), type), type));
              break;
            case 'time':
              msg = sprintf(l10n('TimeRangeUnderflow'), formatDate(stringToDate(element.getAttribute('min'), type), type));
              break;
            // case 'number':
            default:
              msg = sprintf(l10n('NumberRangeUnderflow'), stringToNumber(element.getAttribute('min'), type));
              break;
          }
          setMsg(element, 'rangeUnderflow', msg);
        });

        var stepMismatch = check$1(testStep, function (element) {
          var list = getNextValid(element);
          var min = list[0];
          var max = list[1];
          var sole = false;
          var msg = void 0;

          if (min === null) {
            sole = max;
          } else if (max === null) {
            sole = min;
          }

          if (sole !== false) {
            msg = sprintf(l10n('StepMismatchOneValue'), sole);
          } else {
            msg = sprintf(l10n('StepMismatch'), min, max);
          }
          setMsg(element, 'stepMismatch', msg);
        });

        var tooLong = check$1(testMaxlength, function (element) {
          setMsg(element, 'tooLong', sprintf(l10n('TextTooLong'), element.getAttribute('maxlength'), unicodeStringLength(element.value)));
        });

        var tooShort = check$1(testMinlength, function (element) {
          setMsg(element, 'tooShort', sprintf(l10n('Please lengthen this text to %l characters or more (you are currently using %l characters).'), element.getAttribute('maxlength'), unicodeStringLength(element.value)));
        });

        var typeMismatch = check$1(testType, function (element) {
          var msg = l10n('Please use the appropriate format.');
          var type = getType(element);

          if (type === 'email') {
            if (element.hasAttribute('multiple')) {
              msg = l10n('Please enter a comma separated list of email addresses.');
            } else {
              msg = l10n('InvalidEmail');
            }
          } else if (type === 'url') {
            msg = l10n('InvalidURL');
          } else if (type === 'file') {
            msg = l10n('Please select a file of the correct type.');
          }

          setMsg(element, 'typeMismatch', msg);
        });

        var valueMissing = check$1(testRequired, function (element) {
          var msg = l10n('ValueMissing');
          var type = getType(element);

          if (type === 'checkbox') {
            msg = l10n('CheckboxMissing');
          } else if (type === 'radio') {
            msg = l10n('RadioMissing');
          } else if (type === 'file') {
            if (element.hasAttribute('multiple')) {
              msg = l10n('Please select one or more files.');
            } else {
              msg = l10n('FileMissing');
            }
          } else if (element instanceof window.HTMLSelectElement) {
            msg = l10n('SelectMissing');
          }

          setMsg(element, 'valueMissing', msg);
        });

        var validityStateCheckers = {
          badInput: badInput,
          customError: customError,
          patternMismatch: patternMismatch,
          rangeOverflow: rangeOverflow,
          rangeUnderflow: rangeUnderflow,
          stepMismatch: stepMismatch,
          tooLong: tooLong,
          tooShort: tooShort,
          typeMismatch: typeMismatch,
          valueMissing: valueMissing
        };

        /**
         * the validity state constructor
         */
        var ValidityState = function ValidityState(element) {
          if (!(element instanceof window.HTMLElement)) {
            throw new Error('cannot create a ValidityState for a non-element');
          }

          var cached = ValidityState.cache.get(element);
          if (cached) {
            return cached;
          }

          if (!(this instanceof ValidityState)) {
            /* working around a forgotten `new` */
            return new ValidityState(element);
          }

          this.element = element;
          ValidityState.cache.set(element, this);
        };

        /**
         * the prototype for new validityState instances
         */
        var ValidityStatePrototype = {};
        ValidityState.prototype = ValidityStatePrototype;

        ValidityState.cache = new WeakMap();

        /**
         * copy functionality from the validity checkers to the ValidityState
         * prototype
         */
        for (var prop in validityStateCheckers) {
          Object.defineProperty(ValidityStatePrototype, prop, {
            configurable: true,
            enumerable: true,
            get: function (func) {
              return function () {
                return func(this.element);
              };
            }(validityStateCheckers[prop]),
            set: undefined
          });
        }

        /**
         * the "valid" property calls all other validity checkers and returns true,
         * if all those return false.
         *
         * This is the major access point for _all_ other API methods, namely
         * (check|report)Validity().
         */
        Object.defineProperty(ValidityStatePrototype, 'valid', {
          configurable: true,
          enumerable: true,
          get: function get() {
            var wrapper = getWrapper(this.element);
            var validClass = wrapper && wrapper.settings.classes.valid || 'hf-valid';
            var invalidClass = wrapper && wrapper.settings.classes.invalid || 'hf-invalid';
            var validatedClass = wrapper && wrapper.settings.classes.validated || 'hf-validated';

            this.element.classList.add(validatedClass);

            if (isValidationCandidate(this.element)) {
              for (var _prop in validityStateCheckers) {
                if (validityStateCheckers[_prop](this.element)) {
                  this.element.classList.add(invalidClass);
                  this.element.classList.remove(validClass);
                  this.element.setAttribute('aria-invalid', 'true');
                  return false;
                }
              }
            }

            messageStore.delete(this.element);
            this.element.classList.remove(invalidClass);
            this.element.classList.add(validClass);
            this.element.setAttribute('aria-invalid', 'false');
            return true;
          },
          set: undefined
        });

        /**
         * mark the validity prototype, because that is what the client-facing
         * code deals with mostly, not the property descriptor thing */
        mark(ValidityStatePrototype);

        /**
         * check an element's validity with respect to it's form
         */
        var checkValidity = returnHookOr('checkValidity', function (element) {
          /* if this is a <form>, check validity of all child inputs */
          if (element instanceof window.HTMLFormElement) {
            return Array.prototype.map.call(element.elements, checkValidity).every(function (b) {
              return b;
            });
          }

          /* default is true, also for elements that are no validation candidates */
          var valid = ValidityState(element).valid;
          if (valid) {
            var wrappedForm = getWrapper(element);
            if (wrappedForm && wrappedForm.settings.validEvent) {
              triggerEvent(element, 'valid');
            }
          } else {
            triggerEvent(element, 'invalid', { cancelable: true });
          }

          return valid;
        });

        var version = '0.8.9';

        /**
         * public hyperform interface:
         */
        function hyperform(form) {
          var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var _ref$strict = _ref.strict;
          var strict = _ref$strict === undefined ? false : _ref$strict;
          var _ref$preventImplicitS = _ref.preventImplicitSubmit;
          var preventImplicitSubmit = _ref$preventImplicitS === undefined ? false : _ref$preventImplicitS;
          var revalidate = _ref.revalidate;
          var validEvent = _ref.validEvent;
          var extendFieldset = _ref.extendFieldset;
          var novalidateOnElements = _ref.novalidateOnElements;
          var classes = _ref.classes;


          if (revalidate === undefined) {
            /* other recognized values: 'oninput', 'onblur', 'onsubmit' and 'never' */
            revalidate = strict ? 'onsubmit' : 'hybrid';
          }
          if (validEvent === undefined) {
            validEvent = !strict;
          }
          if (extendFieldset === undefined) {
            extendFieldset = !strict;
          }
          if (novalidateOnElements === undefined) {
            novalidateOnElements = !strict;
          }
          if (!classes) {
            classes = {};
          }

          var settings = { strict: strict, preventImplicitSubmit: preventImplicitSubmit, revalidate: revalidate, validEvent: validEvent,
            extendFieldset: extendFieldset, classes: classes };

          if (form instanceof window.NodeList || form instanceof window.HTMLCollection || form instanceof Array) {
            return Array.prototype.map.call(form, function (element) {
              return hyperform(element, settings);
            });
          }

          return new Wrapper(form, settings);
        }

        hyperform.version = version;

        hyperform.checkValidity = checkValidity;
        hyperform.reportValidity = reportValidity;
        hyperform.setCustomValidity = setCustomValidity;
        hyperform.stepDown = stepDown;
        hyperform.stepUp = stepUp;
        hyperform.validationMessage = validationMessage;
        hyperform.ValidityState = ValidityState;
        hyperform.valueAsDate = valueAsDate;
        hyperform.valueAsNumber = valueAsNumber;
        hyperform.willValidate = willValidate;

        hyperform.setLanguage = function (lang) {
          setLanguage(lang);return hyperform;
        };
        hyperform.addTranslation = function (lang, catalog) {
          addTranslation(lang, catalog);return hyperform;
        };
        hyperform.setRenderer = function (renderer, action) {
          Renderer.set(renderer, action);return hyperform;
        };
        hyperform.addValidator = function (element, validator) {
          customValidatorRegistry.set(element, validator);return hyperform;
        };
        hyperform.setMessage = function (element, validator, message) {
          customMessages.set(element, validator, message);return hyperform;
        };
        hyperform.addHook = function (hook, action, position) {
          addHook(hook, action, position);return hyperform;
        };
        hyperform.removeHook = function (hook, action) {
          removeHook(hook, action);return hyperform;
        };

        return hyperform;

});