'use strict';


import installer from '../tools/property_installer';
import valueAsDate from './valueAsDate';


const applicable_types = [ 'date', 'month', 'week', 'time', 'datetime',
  'datetime-local', 'number', 'range', ];


/**
 * implement the valueAsNumber functionality
 *
 * @see https://html.spec.whatwg.org/multipage/forms.html#dom-input-valueasnumber
 */
function valueAsNumber(value=undefined) {
  /* jshint -W040 */
  if (this.type in applicable_types) {
    if (this.type === 'range' && this.hasAttribute('multiple')) {
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

    let rval = valueAsDate.call(this);
    if (rval !== null) {
      return +rval;
    }
    /* not parseFloat, because we want NaN for invalid values like "1.2xxy" */
    return Number(this.value);

  } else if (value !== undefined) {
    /* trying to set a number on a not-number input fails */
    throw new window.DOMException(
      'valueAsNumber setter cannot set number on this element',
      'InvalidStateError');
  }
  /* jshint +W040 */

  return NaN;
}


valueAsNumber.install('valueAsNumber', {
  configurable: true,
  enumerable: true,
  get: valueAsNumber,
  set: valueAsNumber,
});


export default valueAsNumber;
