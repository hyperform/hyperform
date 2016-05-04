'use strict';


import get_type from '../tools/get_type';
import mark from '../tools/mark';
import installer from '../tools/property_installer';
import string_to_number from '../tools/string_to_number';
import { numbers } from '../components/types';
import valueAsDate from './valueAsDate';


/**
 * implement the valueAsNumber functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasnumber
 */
function valueAsNumber(value=undefined) {
  /* jshint -W040 */
  const type = get_type(this);
  if (numbers.indexOf(type) > -1) {
    if (type === 'range' && this.hasAttribute('multiple')) {
      /* @see https://html.spec.whatwg.org/multipage/forms.html#do-not-apply */
      return NaN;
    }

    if (value !== undefined) {
      /* setter: value must be NaN or a finite number */
      if (isNaN(value)) {
        this.value = '';
      } else if (typeof value === 'number' && window.isFinite(value)) {
        try {
          /* try setting as a date, but... */
          valueAsDate.call(this, new Date(value));
        } catch (e) {
          /* ... when valueAsDate is not responsible, ... */
          if (! (e instanceof window.DOMException)) {
            throw e;
          }
          /* ... set it via Number.toString(). */
          this.value = value.toString();
        }
      } else {
        throw new window.DOMException(
          'valueAsNumber setter encountered invalid value', 'TypeError');
      }
      return;
    }

    return string_to_number(this.value, type);

  } else if (value !== undefined) {
    /* trying to set a number on a not-number input fails */
    throw new window.DOMException(
      'valueAsNumber setter cannot set number on this element',
      'InvalidStateError');
  }
  /* jshint +W040 */

  return NaN;
}


valueAsNumber.install = installer('valueAsNumber', {
  configurable: true,
  enumerable: true,
  get: valueAsNumber,
  set: valueAsNumber,
});

mark(valueAsNumber);

export default valueAsNumber;
