'use strict';


import is_validation_candidate from '../tools/is_validation_candidate';
import { numbers } from '../components/types';
import string_to_number from '../tools/string_to_number';


const default_step = {
  'datetime-local': 60,
  datetime: 60,
  time: 60,
};

const step_scale_factor = {
  'datetime-local': 1000,
  datetime: 1000,
  date: 86400000,
  week: 604800000,
  time: 1000,
};

const default_step_base = {
  week: -259200000,
}

/**
 * test the step attribute
 *
 * @TODO type=month will get wrong results. We need to implement month-wide
 *       steps. See https://html.spec.whatwg.org/multipage/forms.html#month-state-%28type=month%29
 */
export default function(element) {

  if (! is_validation_candidate(element) ||
      ! element.value ||
      numbers.indexOf(element.type) === -1 ||
      (element.getAttribute('step') || '').toLowerCase() === 'any') {
    /* we're not responsible here */
    return true;
  }

  let step = element.getAttribute('step');
  if (step) {
    step = string_to_number(step, element.type);
  } else {
    step = default_step[element.type] || 1;
  }

  if (step <= 0 || isNaN(step)) {
    /* error in specified "step". We cannot validate against it, so the value
     * is true. */
    return true;
  }

  const scale = step_scale_factor[element.type] || 1;

  const value = string_to_number(element.value, element.type);
  const min = string_to_number(element.getAttribute('min') ||
                         element.getAttribute('value') || '', element.type);

  let base = min;
  if (isNaN(base)) {
    base = default_step_base[element.type] || 0;
  }

  const result = Math.abs(base - value) % (step * scale);

  return (result < 0.00000001 ||
          /* crappy floating-point arithmetics! */
          result > (step * scale) - 0.00000001);
}
