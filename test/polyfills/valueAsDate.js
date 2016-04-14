'use strict';

import test from 'ava';
import valueAsDate from '../../src/polyfills/valueAsDate';

test.before(() => {
  global.window = {
    DOMException: (a, b) => {},
  };
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
  }, new Date(0)), /.*cannot set date.*/);
});
