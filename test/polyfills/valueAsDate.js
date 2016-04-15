'use strict';

import test from 'ava';
import valueAsDate from '../../src/polyfills/valueAsDate';

test('valueAsDate getter (month)', t => {
  t.is(+valueAsDate.call({
    type: 'month',
    value: '2015-01',
  }), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsDate setter (month)', t => {
  let el = {
    type: 'month',
    value: '',
  };
  valueAsDate.call(el, new Date(Date.UTC(2015, 0, 1)));
  t.is(+valueAsDate.call(el), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsDate getter for non-applicable type', t => {
  t.is(valueAsDate.call({
    type: 'text',
    value: '2015-01-01',
  }), null);
});

test('valueAsDate setter for non-applicable type', t => {
  t.throws(() => valueAsDate.call({
    type: 'text',
    value: '',
  }, new Date(0)), window.DOMException);
});
