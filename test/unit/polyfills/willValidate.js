'use strict';

import test from 'ava';
import willValidate from '../../../src/polyfills/willValidate';

test('willValidate', t => {
  var input = document.createElement('input');
  input.setAttribute('name', 'foo');
  input.type = 'hidden';
  t.false(willValidate(input));
  input.type = 'text';
  t.true(willValidate(input));
  var select = document.createElement('select');
  select.setAttribute('name', 'foo');
  t.true(willValidate(select));
});
