'use strict';


import date_to_string from './date_to_string';
import string_to_number from './string_to_number';
import get_type from './get_type';
import _ from '../components/localization';
import { default_step, step_scale_factor, default_step_base, default_min,
         default_max, } from '../components/step_defaults';
import { dates } from '../components/types';


/**
 * get previous and next valid values for a stepped input element
 */
export default function(element, n=1) {
  const type = get_type(element);

  const aMin = element.getAttribute('min');
  let min = default_min[type] || NaN;
  if (aMin) {
    const pMin = string_to_number(aMin, type);
    if (! isNaN(pMin)) {
      min = pMin;
    }
  }

  const aMax = element.getAttribute('max');
  let max = default_max[type] || NaN;
  if (aMax) {
    const pMax = string_to_number(aMax, type);
    if (! isNaN(pMax)) {
      max = pMax;
    }
  }

  const aStep = element.getAttribute('step');
  let step = default_step[type] || 1;
  if (aStep && aStep.toLowerCase() === 'any') {
    /* quick return: we cannot calculate prev and next */
    return [_('any value'), _('any value')];
  } else if (aStep) {
    const pStep = string_to_number(aStep, type);
    if (! isNaN(pStep)) {
      step = pStep;
    }
  }

  const default_value = string_to_number(element.getAttribute('value'), type);

  const value = string_to_number(element.value ||
                                 element.getAttribute('value'), type);

  if (isNaN(value)) {
    /* quick return: we cannot calculate without a solid base */
    return [_('any valid value'), _('any valid value')];
  }

  const step_base = (
    ! isNaN(min)? min : (
      ! isNaN(default_value)? default_value : (
        default_step_base[type] || 0
      )
    )
  );

  const scale = step_scale_factor[type] || 1;

  var prev = step_base +
    Math.floor((value - step_base) / (step * scale)) * (step * scale) * n;
  var next = step_base +
    (Math.floor((value - step_base) / (step * scale)) + 1) * (step * scale) * n;

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
    prev = date_to_string(new Date(prev), type);
    next = date_to_string(new Date(next), type);
  }

  return [prev, next];
}
