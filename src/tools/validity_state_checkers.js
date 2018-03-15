'use strict';

/**
 * Implement constraint checking functionality defined in the HTML5 standard
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
 * @return bool true if the test fails [!], false otherwise
 */


import format_date from './format_date';
import get_next_valid from './get_next_valid';
import get_type from './get_type';
import sprintf from './sprintf';
import string_to_number from './string_to_number';
import string_to_date from './string_to_date';
import unicode_string_length from './unicode_string_length';
import custom_messages from '../components/custom_messages';
import _ from '../components/localization';
import { message_store } from '../components/message_store';
import CustomValidatorRegistry from '../components/registry';
import { get_wrapper } from '../components/wrapper';
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
  const cvl = custom_validators.length;
  var valid = true;

  if (cvl) {
    for (let i = 0; i < cvl; i++) {
      const result = custom_validators[i](element);
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


/**
 * TODO: when rangeOverflow and rangeUnderflow are both called directly and
 * successful, the inRange and outOfRange classes won't get removed, unless
 * element.validityState.valid is queried, too.
 */
const rangeOverflow = check(test_max, element => {
  const type = get_type(element);
  const wrapper = get_wrapper(element);
  const outOfRangeClass = wrapper && wrapper.settings.classes.outOfRange || 'hf-out-of-range';
  const inRangeClass = wrapper && wrapper.settings.classes.inRange || 'hf-in-range';

  let msg;

  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeOverflow'),
                    format_date(string_to_date(element.getAttribute('max'), type), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeOverflow'),
                    format_date(string_to_date(element.getAttribute('max'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeOverflow'),
                    string_to_number(element.getAttribute('max'), type));
      break;
  }

  set_msg(element, 'rangeOverflow', msg);
  element.classList.add(outOfRangeClass);
  element.classList.remove(inRangeClass);
});


const rangeUnderflow = check(test_min, element => {
  const type = get_type(element);
  const wrapper = get_wrapper(element);
  const outOfRangeClass = wrapper && wrapper.settings.classes.outOfRange || 'hf-out-of-range';
  const inRangeClass = wrapper && wrapper.settings.classes.inRange || 'hf-in-range';

  let msg;

  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(_('DateRangeUnderflow'),
                    format_date(string_to_date(element.getAttribute('min'), type), type));
      break;
    case 'time':
      msg = sprintf(_('TimeRangeUnderflow'),
                    format_date(string_to_date(element.getAttribute('min'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(_('NumberRangeUnderflow'),
                    string_to_number(element.getAttribute('min'), type));
      break;
  }

  set_msg(element, 'rangeUnderflow', msg);
  element.classList.add(outOfRangeClass);
  element.classList.remove(inRangeClass);
});


const stepMismatch = check(test_step, element => {
  const list = get_next_valid(element);
  const min = list[0];
  const max = list[1];
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
                  element.getAttribute('minlength'),
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
