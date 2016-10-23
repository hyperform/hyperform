'use strict';


import getType from '../tools/getType';
import stringToDate from '../tools/stringToDate';
import dateToString from '../tools/dateToString';
import { dates } from '../components/types';


/**
 * implement the valueAsDate functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasdate
 */
export default function valueAsDate(element, value=undefined) {
  const type = getType(element);
  if (dates.indexOf(type) > -1) {
    if (value !== undefined) {
      /* setter: value must be null or a Date() */
      if (value === null) {
        element.value = '';
      } else if (value instanceof Date) {
        if (isNaN(value.getTime())) {
          element.value = '';
        } else {
          element.value = dateToString(value, type);
        }
      } else {
        throw new window.DOMException(
          'valueAsDate setter encountered invalid value', 'TypeError');
      }
      return;
    }

    const valueDate = stringToDate(element.value, type);
    return valueDate instanceof Date? valueDate : null;

  } else if (value !== undefined) {
    /* trying to set a date on a not-date input fails */
    throw new window.DOMException(
      'valueAsDate setter cannot set date on this element',
      'InvalidStateError');
  }

  return null;
}
