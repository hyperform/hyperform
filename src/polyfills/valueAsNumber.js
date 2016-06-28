'use strict';


import get_type from '../tools/get_type';
import string_to_number from '../tools/string_to_number';
import { numbers } from '../components/types';
import valueAsDate from './valueAsDate';


/**
 * implement the valueAsNumber functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasnumber
 */
export default function valueAsNumber(element, value=undefined) {
  const type = get_type(element);
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
          if (! (e instanceof window.DOMException)) {
            throw e;
          }
          /* ... set it via Number.toString(). */
          element.value = value.toString();
        }
      } else {
        throw new window.DOMException(
          'valueAsNumber setter encountered invalid value', 'TypeError');
      }
      return;
    }

    return string_to_number(element.value, type);

  } else if (value !== undefined) {
    /* trying to set a number on a not-number input fails */
    throw new window.DOMException(
      'valueAsNumber setter cannot set number on this element',
      'InvalidStateError');
  }

  return NaN;
}
