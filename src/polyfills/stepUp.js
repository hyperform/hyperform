'use strict';


import get_next_valid from '../tools/get_next_valid';
import get_type from '../tools/get_type';
import mark from '../tools/mark';
import installer from '../tools/property_installer';
import { numbers } from '../components/types';


/**
 *
 */
function stepUp(element, n=1) {
  if (numbers.indexOf(get_type(element)) === -1) {
    throw new window.DOMException('stepUp encountered invalid type',
                                  'InvalidStateError');
  }
  if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
    throw new window.DOMException('stepUp encountered step "any"',
                                  'InvalidStateError');
  }

  var { prev, next } = get_next_valid(element, n);

  if (next !== null) {
    valueAsNumber.call(element, next);
  }
}

stepUp.install = installer('stepUp', {
  configurable: true,
  enumerable: true,
  value: function(n=1) { return stepUp(this, n); },
  writable: true,
});

mark(stepUp);

export default stepUp;
