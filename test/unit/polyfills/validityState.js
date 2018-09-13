'use strict';

import test from 'ava';
import ValidityState from '../../../src/polyfills/validityState';
import Registry from '../../../src/components/registry';

test('ValidityState customError non-bool response', t => {
  var input = document.createElement('input');
  input.setAttribute('name', 'foo');
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
  input.setAttribute('name', 'foo');

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
  input.setAttribute('name', 'foo');
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

test('ValidityState valid', t => {
  var input = document.createElement('input');
  input.required = true;

  t.false(ValidityState(input).valid);
  t.true(input.classList.contains('hf-validated'));
  t.true(input.hasAttribute('aria-invalid'));
});
