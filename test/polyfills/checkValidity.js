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

  checkValidity.install(input);
  t.true(input.checkValidity());
});

/* just have to come to grips with Promise */
test.skip('checkValidity invalid event', async t => {
  var input = document.createElement('input');
  input.type = 'text';
  input.value = '';

  let event_called = Promise();

  t.true(await event_called);
  el.addEventListener('invalid', function() {
    event_called.resolve();
  });
  checkValidity(input);
});
