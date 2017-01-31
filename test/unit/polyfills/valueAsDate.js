'use strict';

import test from 'ava';
import valueAsDate from '../../../src/polyfills/valueAsDate';

function get(attributes) {
  var el = document.createElement('input');
  for (let key in attributes) {
    el.setAttribute(key, attributes[key]);
    if (key === 'value') {
      el[key] = attributes[key];
    }
  }
  return el;
}

test('valueAsDate getter (month)', t => {
  t.is(+valueAsDate(get({
    type: 'month',
    value: '2015-01',
  })), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsDate setter (month)', t => {
  let el = get({
    type: 'month',
    value: '',
  });
  valueAsDate(el, new Date(Date.UTC(2015, 0, 1)));
  t.is(+valueAsDate(el), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsDate getter (week)', t => {
  t.is(+valueAsDate(get({
    type: 'week',
    value: '2015-W51',
  })), +(new Date(Date.UTC(2015, 11, 14))));
});

test('valueAsDate setter (week)', t => {
  let el = get({
    type: 'week',
    value: '',
  });
  valueAsDate(el, new Date(Date.UTC(2015, 11, 14)));
  t.is(+valueAsDate(el), +(new Date(Date.UTC(2015, 11, 14))));
});

test('valueAsDate setter with wrong type', t => {
  t.throws(() => valueAsDate(get({
    type: 'date',
    value: '',
  }), '2015-01-01'), window.DOMException);
});

test('valueAsDate getter for non-applicable type', t => {
  t.is(valueAsDate(get({
    type: 'text',
    value: '2015-01-01',
  })), null);
});

test('valueAsDate setter for non-applicable type', t => {
  t.throws(() => valueAsDate(get({
    type: 'text',
    value: '',
  }), new Date(0)), window.DOMException);
});
