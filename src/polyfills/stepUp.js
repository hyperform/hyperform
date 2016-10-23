'use strict';


import getNextValid from '../tools/getNextValid';
import getType from '../tools/getType';
import { numbers } from '../components/types';
import valueAsNumber from './valueAsNumber';


/**
 *
 */
export default function stepUp(element, n=1) {
  if (numbers.indexOf(getType(element)) === -1) {
    throw new window.DOMException('stepUp encountered invalid type',
                                  'InvalidStateError');
  }
  if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
    throw new window.DOMException('stepUp encountered step "any"',
                                  'InvalidStateError');
  }

  const next = getNextValid(element, n)[1];

  if (next !== null) {
    valueAsNumber(element, next);
  }
}
