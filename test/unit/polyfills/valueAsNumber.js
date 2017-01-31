'use strict';

import test from 'ava';
import valueAsNumber from '../../../src/polyfills/valueAsNumber';

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

test('valueAsNumber getter (number)', t => {
  t.is(valueAsNumber(get({
    type: 'number',
    value: '1',
  })), 1);
});

test('valueAsNumber setter (number)', t => {
  let el = get({
    type: 'number',
    value: '',
  });
  valueAsNumber(el, 1);
  t.is(valueAsNumber(el), 1);
});

test('valueAsNumber getter (month)', t => {
  t.is(valueAsNumber(get({
    type: 'month',
    value: '2015-01',
  })), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsNumber setter (month)', t => {
  let el = get({
    type: 'month',
    value: '',
  });
  valueAsNumber(el, +(new Date(Date.UTC(2015, 0, 1))));
  t.is(valueAsNumber(el), +(new Date(Date.UTC(2015, 0, 1))));
});

test('valueAsNumber setter with wrong type', t => {
  t.throws(() => valueAsNumber(get({
    type: 'number',
    value: '',
  }), '1'), window.DOMException);
});

test('valueAsNumber getter for non-applicable type', t => {
  t.true(isNaN(valueAsNumber(get({
    type: 'text',
    value: '1',
  }))));
});

test('valueAsNumber setter for non-applicable type', t => {
  t.throws(() => valueAsNumber(get({
    type: 'text',
    value: '',
  }), 1), window.DOMException);
});
