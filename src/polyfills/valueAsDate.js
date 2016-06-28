'use strict';


import get_type from '../tools/get_type';
import string_to_date from '../tools/string_to_date';
import date_to_string from '../tools/date_to_string';
import { dates } from '../components/types';


/**
 * implement the valueAsDate functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasdate
 */
export default function valueAsDate(element, value=undefined) {
  const type = get_type(element);
  if (dates.indexOf(type) > -1) {
    if (value !== undefined) {
      /* setter: value must be null or a Date() */
      if (value === null) {
        element.value = '';
      } else if (value instanceof Date) {
        if (isNaN(value.getTime())) {
          element.value = '';
        } else {
          element.value = date_to_string(value, type);
        }
      } else {
        throw new window.DOMException(
          'valueAsDate setter encountered invalid value', 'TypeError');
      }
      return;
    }

    const value_date = string_to_date(element.value, type);
    return value_date instanceof Date? value_date : null;

  } else if (value !== undefined) {
    /* trying to set a date on a not-date input fails */
    throw new window.DOMException(
      'valueAsDate setter cannot set date on this element',
      'InvalidStateError');
  }

  return null;
}
