'use strict';

/**
 * Implement constraint checking functionality defined in the HTML5 standard
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
 * @return bool true if the test fails [!], false otherwise
 */


import get_next_valid from '../tools/get_next_valid';
import get_type from '../tools/get_type';
import sprintf from '../tools/sprintf';
import string_to_number from '../tools/string_to_number';
import string_to_date from '../tools/string_to_date';
import unicode_string_length from '../tools/unicode_string_length';
import custom_messages from '../components/custom_messages';
import _ from '../components/localization';
import message_store from '../components/message_store';
import CustomValidatorRegistry from '../components/registry';
import test_bad_input from '../validators/bad_input';
import test_max from '../validators/max';
import test_maxlength from '../validators/maxlength';
import test_min from '../validators/min';
import test_minlength from '../validators/minlength';
import test_pattern from '../validators/pattern';
import test_required from '../validators/required';
import test_step from '../validators/step';
import test_type from '../validators/type';


/**
 * boilerplate function for all tests but customError
 */
function check(test, react) {
  return element => {
    const invalid = ! test(element);
    if (invalid) {
      react(element);
    }
    return invalid;
  };
}


/**
 * create a common function to set error messages
 */
function set_msg(element, msgtype, _default) {
  message_store.set(element, custom_messages.get(element, msgtype, _default));
}


const badInput = check(test_bad_input, element => set_msg(element, 'badInput',
                       _('Please match the requested type.')));


function customError(element) {
  /* check, if there are custom validators in the registry, and call
   * them. */
  const custom_validators = CustomValidatorRegistry.get(element);
  var valid = true;

  if (custom_validators.length) {
    for (const validator of custom_validators) {
      const result = validator(element);
      if (result !== undefined && ! result) {
        valid = false;
        /* break on first invalid response */
        break;
      }
    }
  }

  /* check, if there are other validity messages already */
  if (valid) {
    const msg = message_store.get(element);
    valid = ! (msg.toString() && ('is_custom' in msg));
  }

  return ! valid;
}


const patternMismatch = check(test_pattern, element => {
  set_msg(element, 'patternMismatch',
    element.title?
      sprintf(_('PatternMismatchWithTitle'), element.title)
      :
      _('PatternMismatch')
  );
});


const rangeOverflow = check(test_max, element => {
  const type = get_type(element);
  let msg;
  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeOverflow'),
                    string_to_date(element.getAttribute('max'), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeOverflow'),
                    string_to_date(element.getAttribute('max'), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeOverflow'),
                    string_to_number(element.getAttribute('max'), type));
      break;
  }
  set_msg(element, 'rangeOverflow', msg);
});


const rangeUnderflow = check(test_min, element => {
  const type = get_type(element);

  let msg;
  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeUnderflow'),
                    string_to_date(element.getAttribute('min'), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeUnderflow'),
                    string_to_date(element.getAttribute('min'), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeUnderflow'),
                    string_to_number(element.getAttribute('min'), type));
      break;
  }
  set_msg(element, 'rangeUnderflow', msg);
});


const stepMismatch = check(test_step, element => {
  let [min, max] = get_next_valid(element);
  let sole = false;
  let msg;

  if (min === null) {
    sole = max;
  } else if (max === null) {
    sole = min;
  }

  if (sole !== false) {
    msg = sprintf(_('StepMismatchOneValue'), sole);
  } else {
    msg = sprintf(_('StepMismatch'), min, max);
  }
  set_msg(element, 'stepMismatch', msg);
});


const tooLong = check(test_maxlength, element => {
  set_msg(element, 'tooLong',
          sprintf(_('TextTooLong'), element.getAttribute('maxlength'),
                  unicode_string_length(element.value)));
});


const tooShort = check(test_minlength, element => {
  set_msg(element, 'tooShort',
          sprintf(_('Please lengthen this text to %l characters or more (you are currently using %l characters).'),
                  element.getAttribute('maxlength'),
                  unicode_string_length(element.value)));
});


const typeMismatch = check(test_type, element => {
  let msg = _('Please use the appropriate format.');
  const type = get_type(element);

  if (type === 'email') {
    if (element.hasAttribute('multiple')) {
      msg = _('Please enter a comma separated list of email addresses.');
    } else {
      msg = _('InvalidEmail');
    }
  } else if (type === 'url') {
    msg = _('InvalidURL');
  } else if (type === 'file') {
    msg = _('Please select a file of the correct type.');
  }

  set_msg(element, 'typeMismatch', msg);
});


const valueMissing = check(test_required, element => {
  let msg = _('ValueMissing');
  const type = get_type(element);

  if (type === 'checkbox') {
    msg = _('CheckboxMissing');
  } else if (type === 'radio') {
    msg = _('RadioMissing');
  } else if (type === 'file') {
    if (element.hasAttribute('multiple')) {
      msg = _('Please select one or more files.');
    } else {
      msg = _('FileMissing');
    }
  } else if (element instanceof window.HTMLSelectElement) {
    msg = _('SelectMissing');
  }

  set_msg(element, 'valueMissing', msg);
});


export default {
  badInput,
  customError,
  patternMismatch,
  rangeOverflow,
  rangeUnderflow,
  stepMismatch,
  tooLong,
  tooShort,
  typeMismatch,
  valueMissing,
};
