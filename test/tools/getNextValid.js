'use strict';

import test from 'ava';
import getNextValid from '../../src/tools/getNextValid';

function getDummy(value, step=1, min=0, max=100) {
  var dummy = document.createElement('input');
  dummy.value = value;
  dummy.setAttribute('value', value);
  dummy.setAttribute('step', step);
  dummy.setAttribute('min', min);
  dummy.setAttribute('max', max);
  return dummy;
}

test('getNextValid simple case', t => {
  t.deepEqual(getNextValid(getDummy(.5, 1, 0, 1)), [0, 1]);
  t.deepEqual(getNextValid(getDummy(5, 1, 0, 10)), [5, 6]);
  t.deepEqual(getNextValid(getDummy(5.3, 1, 0, 10)), [5, 6]);
});

test('getNextValid negative min', t => {
  t.deepEqual(getNextValid(getDummy(-2.3, 1, -3)), [-3, -2]);
});

test('getNextValid fractional step', t => {
  t.deepEqual(getNextValid(getDummy(0.3, .2)), [.2, .4]);
});

test('getNextValid below min, beyond max', t => {
  t.deepEqual(getNextValid(getDummy(-3)), [null, 0]);
  t.deepEqual(getNextValid(getDummy(103)), [100, null]);
});
