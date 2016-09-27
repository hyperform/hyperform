'use strict';


import get_next_valid from '../tools/get_next_valid';
import get_type from '../tools/get_type';
import { numbers } from '../components/types';
import valueAsNumber from './valueAsNumber';


/**
 *
 */
export default function stepDown(element, n=1) {
  if (numbers.indexOf(get_type(element)) === -1) {
    throw new window.DOMException('stepDown encountered invalid type',
                                  'InvalidStateError');
  }
  if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
    throw new window.DOMException('stepDown encountered step "any"',
                                  'InvalidStateError');
  }

  const prev = get_next_valid(element, n)[0];

  if (prev !== null) {
    valueAsNumber(element, prev);
  }
}
