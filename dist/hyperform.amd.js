define(function () { 'use strict';

    function trigger_event (element, event, _ref) {
        var _ref$bubbles = _ref.bubbles;
        var bubbles = _ref$bubbles === undefined ? true : _ref$bubbles;
        var _ref$cancelable = _ref.cancelable;
        var cancelable = _ref$cancelable === undefined ? false : _ref$cancelable;

        if (!(event instanceof window.Event)) {
            var _event = document.createEvent('Event');
            _event.initEvent(event, bubbles, cancelable);
            event = _event;
        }
        element.dispatchEvent(event);
    }

    function installer (property, descriptor) {
      return function (element) {
        delete element[property];
        Object.defineProperty(element, property, descriptor);
      };
    }

    /* missing from this set are: button, hidden, menu (from <button>), reset */

    var validation_candidate_types = ['checkbox', 'color', 'date', 'datetime', 'datetime-local', 'email', 'file', 'image', 'month', 'number', 'password', 'radio', 'range', 'search', 'submit', 'tel', 'text', 'time', 'url', 'week'];

    /**
     * check if an element is a candidate for constraint validation
     *
     * @see https://html.spec.whatwg.org/multipage/forms.html#barred-from-constraint-validation
     */
    function is_validation_candidate (element) {
      /* it must be any of those elements */
      if (element instanceof window.HTMLSelectElement || element instanceof window.HTMLTextAreaElement || element instanceof window.HTMLButtonElement || element instanceof window.HTMLInputElement) {

        /* it's type must be in the whitelist or missing (select, textarea) */
        if (!element.type || validation_candidate_types.includes(element.type)) {

          /* it mustn't be disabled or readonly */
          if (!element.disabled && !element.readonly) {

            /* then it's a candidate */
            return true;
          }
        }
      }

      /* this is no HTML5 validation candidate... */
      return false;
    }

    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    function _slicedToArray (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };

    function sprintf (str) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var args_length = args.length;

      for (var i = 0; i < args_length; i++) {
        var arg = args[i];
        if (arg instanceof Date || typeof arg === 'number' || arg instanceof Number) {
          /* try getting a localized representation of dates and numbers, if the
           * browser supports this */
          arg = (arg.toLocaleString || arg.toString).call(arg);
        }
        str = str.replace('%s', args[i]);
        str = str.replace(new RegExp('%' + (i + 1) + '\\$s', 'g'), args[i]);
      }

      return str;
    }

    /**
     * get previous and next valid values for a stepped input element
     *
     * TODO add support for date, time, ...
     */

    function get_next_valid (element) {
      var min = Number(element.getAttribute('min') || 0);
      var max = Number(element.getAttribute('max') || 100);
      var step = Number(element.getAttribute('step') || 1);
      var value = Number(element.value || 0);

      var prev = min + Math.floor((value - min) / step) * step;
      var next = min + (Math.floor((value - min) / step) + 1) * step;

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

      return [prev, next];
    }

    var message_store = new WeakMap();

    var catalog = {};

    function _ (s) {
      if (s in catalog) {
        return catalog[s];
      }
      return s;
    }

    /**
     * test the max attribute
     *
     * @TODO support max in type=date fields
     */
    function test_max (element) {
      /* we use Number() instead of parseFloat(), because an invalid attribute
       * value like "123abc" should result in an error. */
      return !is_validation_candidate(element) || !element.value || !element.hasAttribute('max') || isNaN(Number(element.getAttribute('max'))) || Number(element.value) <= Number(element.getAttribute('max'));
    }

    /**
     * test the maxlength attribute
     *
     * Allows empty input. If you do not want this, add the `required` attribute.
     */
    function test_maxlength (element) {
        return !is_validation_candidate(element) || !element.value || !element.hasAttribute('maxlength') || element.value.length >= parseInt(element.getAttribute('maxlength'), 10);
    }

    /**
     * test the min attribute
     *
     * @TODO support min in type=date fields
     */
    function test_min (element) {
      /* we use Number() instead of parseFloat(), because an invalid attribute
       * value like "123abc" should result in an error. */
      return !is_validation_candidate(element) || !element.value || !element.hasAttribute('min') || isNaN(Number(element.getAttribute('min'))) || Number(element.value) >= Number(element.getAttribute('min'));
    }

    /**
     * test the minlength attribute
     *
     * Allows empty input. If you do not want this, add the `required` attribute.
     */
    function test_minlength (element) {
        return !is_validation_candidate(element) || !element.value || !element.hasAttribute('minlength') || element.value.length >= parseInt(element.getAttribute('minlength'), 10);
    }

    /**
     * test the pattern attribute
     */
    function test_pattern (element) {
        return !is_validation_candidate(element) || !element.value || !element.hasAttribute('pattern') || new RegExp('^(?:' + element.getAttribute('pattern') + ')$').test(element.value);
    }

    /**
     * test the required attribute
     */
    function test_required (element) {
      if (!is_validation_candidate(element) || !element.hasAttribute('required')) {
        /* nothing to do */
        return true;
      }

      switch (element.type) {
        case 'checkbox':
          return element.checked;
        //break;
        case 'radio':
          /* radio inputs have "required" fulfilled, if _any_ other radio
           * with the same name in this form is checked. */
          return element.checked || Array.prototype.filter.call(element.form.getElementsByName(element.name), function (radio) {
            return radio.form === element.form && radio.checked;
          }).length > 0;
        //break;
        default:
          return !!element.value;
      }
    }

    /**
     * test the step attribute
     *
     * @TODO support steps in type=date fields
     */
    function test_step (element) {
      /* we use Number() instead of parseFloat(), because an invalid attribute
       * value like "123abc" should result in an error. */
      // TODO refactor those multiple "Number()" calls
      return !is_validation_candidate(element) || !element.value || !element.hasAttribute('step') || element.getAttribute('step').toLowerCase() === 'any' || Number(element.getAttribute('step')) <= 0 || isNaN(Number(element.getAttribute('step'))) || Math.abs(Number(element.value) - Number(element.getAttribute('min') || 0)) % Number(element.getAttribute('step')) < 0.00000001 || /* crappy floating-point arithmetics! */
      Math.abs(Number(element.value) - Number(element.getAttribute('min') || 0)) % Number(element.getAttribute('step')) > Number(element.getAttribute('step')) - 0.00000001;
    }

    /* the spec says to only check those. ¯\_(ツ)_/¯ */
    var checked_types = ['email', 'url'];

    /* we use a dummy <a> where we set the href to test URL validity */
    var url_canary = document.createElement('a');

    /* see https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address */
    var email_pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    /**
     * test the type-inherent syntax
     */
    function test_type (element) {
      if (!is_validation_candidate(element) || !element.value || !checked_types.contains(element.type)) {
        /* we're not responsible for this element */
        return true;
      }

      var is_valid = true;

      switch (element.type) {
        case 'url':
          url_canary.href = element.value;
          is_valid = url_canary.href === element.value || url_canary.href === element.value + '/';
          break;
        case 'email':
          if (element.hasAttribute('multiple')) {
            is_valid = element.value.split(',').map(function (item) {
              return item.trim();
            }).every(function (value) {
              return email_pattern.test(value);
            });
          } else {
            is_valid = email_pattern.test(element.value);
          }
          break;
      }

      return is_valid;
    }

    /**
     * Implement constraint checking functionality defined in the HTML5 standard
     *
     * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
     * @return bool true if the test fails [!], false otherwise
     */
    var validity_state_checkers = {
      badInput: function badInput(element) {
        // TODO
        return false;
      },

      customError: function customError(element) {
        var msg = message_store.get(element);
        var invalid = msg && 'is_custom' in msg;
        /* no need for message_store.set, because the message is already there. */
        return invalid;
      },

      patternMismatch: function patternMismatch(element) {
        var invalid = !test_pattern(element);
        if (invalid) {
          message_store.set(element, element.title ? sprintf(_('Please match the requested format: %s.'), element.title) : _('Please match the requested format.'));
        }
        return invalid;
      },

      rangeOverflow: function rangeOverflow(element) {
        var invalid = !test_max(element);

        if (invalid) {
          var msg = void 0;
          switch (element.type) {
            case 'date':
            case 'datetime':
            case 'datetime-local':
            case 'time':
              msg = sprintf(_('Please select a value that is no later than %s.'), element.value);
              break;
            case 'number':
            default:
              msg = sprintf(_('Please select a value that is no more than %s.'), element.value);
              break;
          }
          message_store.set(element, msg);
        }

        return invalid;
      },

      rangeUnderflow: function rangeUnderflow(element) {
        var invalid = !test_min(element);

        if (invalid) {
          var msg = void 0;
          switch (element.type) {
            case 'date':
            case 'datetime':
            case 'datetime-local':
            case 'time':
              msg = sprintf(_('Please select a value that is no earlier than %s.'), element.value);
              break;
            case 'number':
            default:
              msg = sprintf(_('Please select a value that is no less than %s.'), element.value);
              break;
          }
          message_store.set(element, msg);
        }

        return invalid;
      },

      stepMismatch: function stepMismatch(element) {
        var invalid = !test_step(element);

        if (invalid) {
          var _get_next_valid = get_next_valid(element);

          var _get_next_valid2 = _slicedToArray(_get_next_valid, 2);

          var min = _get_next_valid2[0];
          var max = _get_next_valid2[1];

          var sole = false;

          if (min === null) {
            sole = max;
          } else if (max === null) {
            sole = min;
          }

          if (sole !== false) {
            message_store.set(element, sprintf(_('Please select a valid value. The nearest valid value is %s.'), sole));
          } else {
            message_store.set(element, sprintf(_('Please select a valid value. The two nearest valid values are %s and %s.'), min, max));
          }
        }

        return invalid;
      },

      tooLong: function tooLong(element) {
        var invalid = !test_maxlength(element);

        if (invalid) {
          message_store.set(element, sprintf(_('Please shorten this text to %s characters or less (you are currently using %s characters).'), element.getAttribute('maxlength'), element.value.length));
        }

        return invalid;
      },

      tooShort: function tooShort(element) {
        var invalid = !test_minlength(element);

        if (invalid) {
          message_store.set(element, sprintf(_('Please lengthen this text to %s characters or more (you are currently using %s characters).'), element.getAttribute('maxlength'), element.value.length));
        }

        return invalid;
      },

      typeMismatch: function typeMismatch(element) {
        var invalid = !test_type(element);

        if (invalid) {
          var msg = _('Please use the appropriate format.');
          if (element.type === 'email') {
            if (element.hasAttribute('multiple')) {
              msg = _('Please enter a comma separated list of email addresses.');
            } else {
              msg = _('Please enter an email address.');
            }
          } else if (element.type === 'url') {
            msg = _('Please enter a URL.');
          }
          message_store.set(element, msg);
        }

        return invalid;
      },

      valueMissing: function valueMissing(element) {
        var invalid = !test_required(element);

        if (invalid) {
          var msg = _('Please fill out this field.');
          if (element.type === 'checkbox') {
            msg = _('Please check this box if you want to proceed.');
          } else if (element.type === 'radio') {
            msg = _('Please select one of these options.');
          } else if (element.type === 'file') {
            if (element.hasAttribute('multiple')) {
              msg = _('Please select one or more files.');
            } else {
              msg = _('Please select a file.');
            }
          } else if (element instanceof window.HTMLSelectElement) {
            msg = _('Please select an item in the list.');
          }
          message_store.set(element, msg);
        }

        return invalid;
      }

    };

    /**
     * TODO allow HTMLFieldSetElement, too
     */
    var ValidityState = function ValidityState(element) {
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

    var ValidityStatePrototype = {};
    ValidityState.prototype = ValidityStatePrototype;

    ValidityState.cache = new WeakMap();

    /**
     * copy functionality from the validity checkers to the ValidityState
     * prototype
     */
    for (var prop in validity_state_checkers) {
      Object.defineProperty(ValidityStatePrototype, prop, {
        configurable: true,
        enumerable: true,
        get: function (func) {
          return function () {
            return func(this.element);
          };
        }(validity_state_checkers[prop]),
        set: undefined
      });
    }

    /**
     * the "valid" property calls all other validity checkers and returns true,
     * if all those return false.
     */
    Object.defineProperty(ValidityStatePrototype, 'valid', {
      configurable: true,
      enumerable: true,
      get: function get() {
        for (var _prop in validity_state_checkers) {
          if (validity_state_checkers[_prop](this.element)) {
            return false;
          }
        }
        return true;
      },
      set: undefined
    });

    /**
     * publish a convenience function to replace the native element.validity
     */
    ValidityState.install = installer('validity', {
      configurable: true,
      enumerable: true,
      value: function value() {
        return new ValidityState(this);
      },
      writable: false
    });

    /**
     * check an element's validity with respect to it's form
     */
    function checkValidity() {
      /* jshint -W040 */

      /* if this is a <form>, check validity of all child inputs */
      if (this instanceof window.HTMLFormElement) {
        return Array.prototype.every.call(this.elements, checkValidity);
      }

      /* default is true, also for elements that are no validation candidates */
      var valid = true;

      if (is_validation_candidate(this)) {
        valid = ValidityState(this).valid;
        if (!valid) {
          trigger_event(this, 'invalid', { cancelable: true });
        }
      }
      /* jshint +W040 */

      return valid;
    }

    /**
     * publish a convenience function to replace the native element.checkValidity
     */
    checkValidity.install = installer('checkValidity', {
      configurable: true,
      enumerable: true,
      value: checkValidity,
      writable: true
    });

    /**
     * TODO allow HTMLFieldSetElement, too
     */
    function setCustomValidity(msg) {
      msg.is_custom = true;
      /* jshint -W040 */
      message_store.set(this, msg);
      /* jshint +W040 */
    }

    /**
     * publish a convenience function to replace the native element.setCustomValidity
     */
    setCustomValidity.install = installer('setCustomValidity', {
      configurable: true,
      enumerable: true,
      get: setCustomValidity,
      set: undefined
    });

    /**
     * TODO allow HTMLFieldSetElement, too
     */
    function validationMessage() {
      /* jshint -W040 */
      var msg = message_store.get(this);
      /* jshint +W040 */
      if (!msg) {
        return '';
      }
      return msg;
    }

    /**
     * publish a convenience function to replace the native element.validationMessage
     */
    validationMessage.install = installer('validationMessage', {
      configurable: true,
      enumerable: true,
      get: validationMessage,
      set: undefined
    });

    /**
     * TODO allow HTMLFieldSetElement, too
     */
    function willValidate() {
      /* jshint -W040 */
      return is_validation_candidate(this);
      /* jshint +W040 */
    }

    /**
     * publish a convenience function to replace the native element.willValidate
     */
    willValidate.install = installer('willValidate', {
      configurable: true,
      enumerable: true,
      get: willValidate,
      set: undefined
    });

    /**
     * public hyperform interface:
     */
    var hyperform = {

      checkValidity: checkValidity,

      setCustomValidity: setCustomValidity,

      validationMessage: validationMessage,

      ValidityState: ValidityState,

      willValidate: willValidate,

      update_form: function update_form(form) {
        var els = form.elements;
        var els_length = els.length;
        for (var i = 0; i < els_length; i++) {
          checkValidity.install(els[i]);
          setCustomValidity.install(els[i]);
          validationMessage.install(els[i]);
          ValidityState.install(els[i]);
          willValidate.install(els[i]);
        }
      }
    };

    window.hyperform = hyperform;

});