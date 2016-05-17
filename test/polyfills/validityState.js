'use strict';

import test from 'ava';
import ValidityState from '../../src/polyfills/validityState';
import Registry from '../../src/components/registry';

test('ValidityState customError non-bool response', t => {
  var input = document.createElement('input');
  Registry.set(input, () => "a");
  t.false(ValidityState(input).customError);
  Registry.delete(input);
  Registry.set(input, () => 1);
  t.false(ValidityState(input).customError);
  Registry.delete(input);
  Registry.set(input, () => 0);
  t.true(ValidityState(input).customError);
});
