'use strict';


import installer from '../tools/property_installer';
import string_to_date from '../tools/string_to_date';
import date_to_string from '../tools/date_to_string';


/* and datetime-local? Spec says “Nah!” */
const applicable_types = [ 'date', 'month', 'week', 'time', ];


/**
 * implement the valueAsDate functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasdate
 */
function valueAsDate(value=undefined) {
  /* jshint -W040 */
  if (this.type in applicable_types) {
    if (value !== undefined) {
      /* setter: value must be null or a Date() */
      if (value === null) {
        this.value = '';
      } else if (value instanceof Date) {
        if (isNaN(value.getTime())) {
          this.value = '';
        } else {
          this.value = date_to_string(value, this.type);
        }
      } else {
        throw new window.DOMException(
          'valueAsDate setter encountered invalid value', 'TypeError');
      }
      return;
    }

    const value_date = string_to_date(this.value, this.type);
    return value_date instanceof Date? value_date : null;

  } else if (value !== undefined) {
    /* trying to set a date on a not-date input fails */
    throw new window.DOMException(
      'valueAsDate setter cannot set date on this element',
      'InvalidStateError');
  }
  /* jshint +W040 */

  return null;
}


valueAsDate.install('valueAsDate', {
  configurable: true,
  enumerable: true,
  get: valueAsDate,
  set: valueAsDate,
});


export default valueAsDate;
