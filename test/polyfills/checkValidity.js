'use strict';

import test from 'ava';
import checkValidity from '../../src/polyfills/checkValidity';
import { addHook, removeHook } from '../../src/components/hooks';

test('checkValidity', t => {
  var input = document.createElement('input');
  input.type = 'hidden';
  t.true(checkValidity(input));
  input.type = 'text';
  t.true(checkValidity(input));
  input.setAttribute('required', 'required');
  t.false(checkValidity(input));
  input.value = 'abc';
  t.true(checkValidity(input));
});

test('checkValidity invalid event', t => {
  var input = document.createElement('input');
  input.setAttribute('required', 'required');
  input.value = '';

  let eventCalled = false;

  input.addEventListener('invalid', function() {
    eventCalled = true;
  });
  checkValidity(input);
  t.true(eventCalled);
});

test('checkValidity hook', t => {
  const input = document.createElement('input');
  input.setAttribute('required', 'required');
  input.value = '';
  const func = () => 'green';
  addHook('checkValidity', func);
  t.is(checkValidity(input), 'green');
  removeHook('checkValidity', func);
  t.is(checkValidity(input), false);
});
