'use strict';


import getType from '../tools/getType';
import isValidationCandidate from '../tools/isValidationCandidate';
import { numbers } from '../components/types';
import { defaultStep, stepScaleFactor, defaultStepBase } from '../components/stepDefaults';
import stringToNumber from '../tools/stringToNumber';


/**
 * test the step attribute
 */
export default function(element) {
  const type = getType(element);

  if (! isValidationCandidate(element) ||
      ! element.value ||
      numbers.indexOf(type) === -1 ||
      (element.getAttribute('step') || '').toLowerCase() === 'any') {
    /* we're not responsible here. Note: If no step attribute is given, we
     * need to validate against the default step as per spec. */
    return true;
  }

  let step = element.getAttribute('step');
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

  const scale = stepScaleFactor[type] || 1;

  let value = stringToNumber(element.value, type);
  let min = stringToNumber(element.getAttribute('min') ||
                         element.getAttribute('value') || '', type);

  if (isNaN(min)) {
    min = defaultStepBase[type] || 0;
  }

  if (type === 'month') {
    /* type=month has month-wide steps. See
     * https://html.spec.whatwg.org/multipage/forms.html#month-state-%28type=month%29
     */
    min = (new Date(min)).getUTCFullYear() * 12 + (new Date(min)).getUTCMonth();
    value = (new Date(value)).getUTCFullYear() * 12 + (new Date(value)).getUTCMonth();
  }

  const result = Math.abs(min - value) % (step * scale);

  return (result < 0.00000001 ||
          /* crappy floating-point arithmetics! */
          result > (step * scale) - 0.00000001);
}
