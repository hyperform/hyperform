'use strict';

import test from 'ava';
import get_next_valid from '../../../src/tools/get_next_valid';

function get_dummy(value, step=1, min=0, max=100) {
  var dummy = document.createElement('input');
  dummy.value = value;
  dummy.setAttribute('value', value);
  dummy.setAttribute('step', step);
  dummy.setAttribute('min', min);
  dummy.setAttribute('max', max);
  return dummy;
}

test('get_next_valid simple case', t => {
  t.deepEqual(get_next_valid(get_dummy(.5, 1, 0, 1)), [0, 1]);
  t.deepEqual(get_next_valid(get_dummy(5, 1, 0, 10)), [5, 6]);
  t.deepEqual(get_next_valid(get_dummy(5.3, 1, 0, 10)), [5, 6]);
});

test('get_next_valid negative min', t => {
  t.deepEqual(get_next_valid(get_dummy(-2.3, 1, -3)), [-3, -2]);
});

test('get_next_valid fractional step', t => {
  t.deepEqual(get_next_valid(get_dummy(0.3, .2)), [.2, .4]);
});

test('get_next_valid below min, beyond max', t => {
  t.deepEqual(get_next_valid(get_dummy(-3)), [null, 0]);
  t.deepEqual(get_next_valid(get_dummy(103)), [100, null]);
});
