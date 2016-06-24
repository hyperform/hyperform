'use strict';

import test from 'ava';
import checkValidity from '../../src/polyfills/checkValidity';

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

test('checkValidity invalid event', async t => {
  var input = document.createElement('input');
  input.setAttribute('required', 'required');
  input.value = '';

  let event_called = false;

  input.addEventListener('invalid', function() {
    event_called = true;
  });
  checkValidity(input);
  t.true(event_called);
});
