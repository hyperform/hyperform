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

test('ValidityState rangeOverflow', t => {
  var input = document.createElement('input');

  input.value = 5;
  t.false(ValidityState(input).rangeOverflow);

  input.type = 'number'
  input.max = 2;
  t.true(ValidityState(input).rangeOverflow);

  input.value = 2;
  t.false(ValidityState(input).rangeOverflow);

  input.max = 1;
  t.true(ValidityState(input).rangeOverflow);

  input.value = '';
  t.false(ValidityState(input).rangeOverflow);
});

test('ValidityState patternMismatch', t => {
  var input = document.createElement('input');
  t.false(ValidityState(input).patternMismatch);

  input.pattern = 'X';
  input.value = 'Y';
  t.true(ValidityState(input).patternMismatch);

  input.value = '';
  t.false(ValidityState(input).patternMismatch);

  input.value = 'X';
  t.false(ValidityState(input).patternMismatch);

  input.value = 'XA';
  t.true(ValidityState(input).patternMismatch);
});
