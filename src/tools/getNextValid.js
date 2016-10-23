'use strict';


import dateToString from './dateToString';
import stringToNumber from './stringToNumber';
import getType from './getType';
import l10n from '../components/localization';
import { defaultStep, stepScaleFactor, defaultStepBase, defaultMin,
         defaultMax, } from '../components/stepDefaults';
import { dates } from '../components/types';


/**
 * get previous and next valid values for a stepped input element
 */
export default function(element, n=1) {
  const type = getType(element);

  const aMin = element.getAttribute('min');
  let min = defaultMin[type] || NaN;
  if (aMin) {
    const pMin = stringToNumber(aMin, type);
    if (! isNaN(pMin)) {
      min = pMin;
    }
  }

  const aMax = element.getAttribute('max');
  let max = defaultMax[type] || NaN;
  if (aMax) {
    const pMax = stringToNumber(aMax, type);
    if (! isNaN(pMax)) {
      max = pMax;
    }
  }

  const aStep = element.getAttribute('step');
  let step = defaultStep[type] || 1;
  if (aStep && aStep.toLowerCase() === 'any') {
    /* quick return: we cannot calculate prev and next */
    return [l10n('any value'), l10n('any value')];
  } else if (aStep) {
    const pStep = stringToNumber(aStep, type);
    if (! isNaN(pStep)) {
      step = pStep;
    }
  }

  const defaultValue = stringToNumber(element.getAttribute('value'), type);

  const value = stringToNumber(element.value ||
                                 element.getAttribute('value'), type);

  if (isNaN(value)) {
    /* quick return: we cannot calculate without a solid base */
    return [l10n('any valid value'), l10n('any valid value')];
  }

  const stepBase = (
    ! isNaN(min)? min : (
      ! isNaN(defaultValue)? defaultValue : (
        defaultStepBase[type] || 0
      )
    )
  );

  const scale = stepScaleFactor[type] || 1;

  var prev = stepBase +
    Math.floor((value - stepBase) / (step * scale)) * (step * scale) * n;
  var next = stepBase +
    (Math.floor((value - stepBase) / (step * scale)) + 1) * (step * scale) * n;

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
