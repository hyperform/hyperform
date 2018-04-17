'use strict';

import test from 'ava';
import checkValidity from '../../../src/polyfills/checkValidity';
import { add_hook, remove_hook } from '../../../src/components/hooks';

test('checkValidity', t => {
  var input = document.createElement('input');
  input.setAttribute('name', 'foo');
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
  input.setAttribute('name', 'foo');
  input.setAttribute('required', 'required');
  input.value = '';

  let event_called = false;

  input.addEventListener('invalid', function() {
    event_called = true;
  });
  checkValidity(input);
  t.true(event_called);
});

test('checkValidity hook', t => {
  const input = document.createElement('input');
  input.setAttribute('name', 'foo');
  input.setAttribute('required', 'required');
  input.value = '';
  const func = () => 'green';
  add_hook('checkValidity', func);
  t.is(checkValidity(input), 'green');
  remove_hook('checkValidity', func);
  t.is(checkValidity(input), false);
});
