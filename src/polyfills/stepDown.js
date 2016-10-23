'use strict';


import getNextValid from '../tools/getNextValid';
import getType from '../tools/getType';
import { numbers } from '../components/types';
import valueAsNumber from './valueAsNumber';


/**
 *
 */
export default function stepDown(element, n=1) {
  if (numbers.indexOf(getType(element)) === -1) {
    throw new window.DOMException('stepDown encountered invalid type',
                                  'InvalidStateError');
  }
  if ((element.getAttribute('step') || '').toLowerCase() === 'any') {
    throw new window.DOMException('stepDown encountered step "any"',
                                  'InvalidStateError');
  }

  const prev = getNextValid(element, n)[0];

  if (prev !== null) {
    valueAsNumber(element, prev);
  }
}
