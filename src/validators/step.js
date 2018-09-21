'use strict';


import get_type from '../tools/get_type';
import { numbers } from '../components/types';
import { default_step, step_scale_factor, default_step_base } from '../components/step_defaults';
import string_to_number from '../tools/string_to_number';


/**
 * test the step attribute
 */
export default function(element) {
  const type = get_type(element);

  if (! element.value ||
      numbers.indexOf(type) === -1 ||
      (element.getAttribute('step') || '').toLowerCase() === 'any') {
    /* we're not responsible here. Note: If no step attribute is given, we
     * need to validate against the default step as per spec. */
    return true;
  }

  let step = element.getAttribute('step');
  if (step) {
    step = string_to_number(step, type);
  } else {
    step = default_step[type] || 1;
  }

  if (step <= 0 || isNaN(step)) {
    /* error in specified "step". We cannot validate against it, so the value
     * is true. */
    return true;
  }

  const scale = step_scale_factor[type] || 1;

  let value = string_to_number(element.value, type);
  let min = string_to_number(element.getAttribute('min') ||
                         element.getAttribute('value') || '', type);

  if (isNaN(value)) {
    /* we cannot compare an invalid value and trust that the badInput validator
     * takes over from here */
    return true;
  }

  if (isNaN(min)) {
    min = default_step_base[type] || 0;
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
