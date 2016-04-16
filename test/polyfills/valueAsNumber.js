'use strict';

import test from 'ava';
import valueAsNumber from '../../src/polyfills/valueAsNumber';

test('valueAsNumber getter (number)', t => {
  t.is(valueAsNumber.call({
    type: 'number',
    value: '1',
  }), 1);
});

test('valueAsNumber setter (number)', t => {
  let el = {
    type: 'number',
    value: '',
  };
  valueAsNumber.call(el, 1);
  t.is(valueAsNumber.call(el), 1);
});

test('valueAsNumber getter (month)', t => {
  t.is(valueAsNumber.call({
    type: 'month',
    value: '2015-01',
  }), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsNumber setter (month)', t => {
  let el = {
    type: 'month',
    value: '',
  };
  valueAsNumber.call(el, +(new Date(Date.UTC(2015, 0, 1))));
  t.is(valueAsNumber.call(el), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsNumber setter with wrong type', t => {
  t.throws(() => valueAsNumber.call({
    type: 'number',
    value: '',
  }, '1'), window.DOMException);
});

test('valueAsNumber getter for non-applicable type', t => {
  t.true(isNaN(valueAsNumber.call({
    type: 'text',
    value: '1',
  })));
});

test('valueAsNumber setter for non-applicable type', t => {
  t.throws(() => valueAsNumber.call({
    type: 'text',
    value: '',
  }, 1), window.DOMException);
});
