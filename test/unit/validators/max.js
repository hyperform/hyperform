'use strict';

import test from 'ava';
import max from '../../../src/validators/max';

test('validator-max', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.type = 'number';
  el.setAttribute('max', '10');
  el.value = '';
  t.is(max(el), true);
  el.value = '10';
  t.is(max(el), true);
  el.value = '0';
  t.is(max(el), true);
  el.value = '-11';
  t.is(max(el), true);
  el.value = '10.00001';
  t.is(max(el), false);
  el.value = '1e14';
  t.is(max(el), false);
});

test('validator-max for date', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.type = 'date';
  el.setAttribute('max', '2015-01-01');
  el.value = '';
  t.is(max(el), true);
  el.value = '2015-01-01';
  t.is(max(el), true);
  el.value = '0000-01-01';
  t.is(max(el), true);
  el.value = '2000-02-29';
  t.is(max(el), true);
  el.value = '2014-12-33';
  t.is(max(el), true);
  el.value = '2015-01-02';
  t.is(max(el), false);
  el.value = '9999-12-31';
  t.is(max(el), false);
});
