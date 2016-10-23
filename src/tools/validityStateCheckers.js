'use strict';

/**
 * Implement constraint checking functionality defined in the HTML5 standard
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-cva-validity
 * @return bool true if the test fails [!], false otherwise
 */


import formatDate from './formatDate';
import getNextValid from './getNextValid';
import getType from './getType';
import sprintf from './sprintf';
import stringToNumber from './stringToNumber';
import stringToDate from './stringToDate';
import unicodeStringLength from './unicodeStringLength';
import customMessages from '../components/customMessages';
import l10n from '../components/localization';
import messageStore from '../components/messageStore';
import CustomValidatorRegistry from '../components/registry';
import testBadInput from '../validators/badInput';
import testMax from '../validators/max';
import testMaxlength from '../validators/maxlength';
import testMin from '../validators/min';
import testMinlength from '../validators/minlength';
import testPattern from '../validators/pattern';
import testRequired from '../validators/required';
import testStep from '../validators/step';
import testType from '../validators/type';


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
function setMsg(element, msgtype, _default) {
  messageStore.set(element, customMessages.get(element, msgtype, _default));
}


const badInput = check(testBadInput, element => setMsg(element, 'badInput',
                       l10n('Please match the requested type.')));


function customError(element) {
  /* check, if there are custom validators in the registry, and call
   * them. */
  const customValidators = CustomValidatorRegistry.get(element);
  const cvl = customValidators.length;
  var valid = true;

  if (cvl) {
    for (let i = 0; i < cvl; i++) {
      const result = customValidators[i](element);
      if (result !== undefined && ! result) {
        valid = false;
        /* break on first invalid response */
        break;
      }
    }
  }

  /* check, if there are other validity messages already */
  if (valid) {
    const msg = messageStore.get(element);
    valid = ! (msg.toString() && ('isCustom' in msg));
  }

  return ! valid;
}


const patternMismatch = check(testPattern, element => {
  setMsg(element, 'patternMismatch',
    element.title?
      sprintf(l10n('PatternMismatchWithTitle'), element.title)
      :
      l10n('PatternMismatch')
  );
});


const rangeOverflow = check(testMax, element => {
  const type = getType(element);
  let msg;
  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(l10n('DateRangeOverflow'),
                    formatDate(stringToDate(element.getAttribute('max'), type), type));
      break;
    case 'time':
      msg = sprintf(l10n('TimeRangeOverflow'),
                    formatDate(stringToDate(element.getAttribute('max'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(l10n('NumberRangeOverflow'),
                    stringToNumber(element.getAttribute('max'), type));
      break;
  }
  setMsg(element, 'rangeOverflow', msg);
});


const rangeUnderflow = check(testMin, element => {
  const type = getType(element);

  let msg;
  switch (type) {
    case 'date':
    case 'datetime':
    case 'datetime-local':
      msg = sprintf(l10n('DateRangeUnderflow'),
                    formatDate(stringToDate(element.getAttribute('min'), type), type));
      break;
    case 'time':
      msg = sprintf(l10n('TimeRangeUnderflow'),
                    formatDate(stringToDate(element.getAttribute('min'), type), type));
      break;
    // case 'number':
    default:
      msg = sprintf(l10n('NumberRangeUnderflow'),
                    stringToNumber(element.getAttribute('min'), type));
      break;
  }
  setMsg(element, 'rangeUnderflow', msg);
});


const stepMismatch = check(testStep, element => {
  const list = getNextValid(element);
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
    msg = sprintf(l10n('StepMismatchOneValue'), sole);
  } else {
    msg = sprintf(l10n('StepMismatch'), min, max);
  }
  setMsg(element, 'stepMismatch', msg);
});


const tooLong = check(testMaxlength, element => {
  setMsg(element, 'tooLong',
          sprintf(l10n('TextTooLong'), element.getAttribute('maxlength'),
                  unicodeStringLength(element.value)));
});


const tooShort = check(testMinlength, element => {
  setMsg(element, 'tooShort',
          sprintf(l10n('Please lengthen this text to %l characters or more (you are currently using %l characters).'),
                  element.getAttribute('maxlength'),
                  unicodeStringLength(element.value)));
});


const typeMismatch = check(testType, element => {
  let msg = l10n('Please use the appropriate format.');
  const type = getType(element);

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


const valueMissing = check(testRequired, element => {
  let msg = l10n('ValueMissing');
  const type = getType(element);

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
