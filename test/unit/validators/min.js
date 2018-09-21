'use strict';

import test from 'ava';
import min from '../../../src/validators/min';

test('validator-min', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.type = 'number';
  el.setAttribute('min', '10');
  el.value = '';
  t.is(min(el), true);
  el.value = '10';
  t.is(min(el), true);
  el.value = '0';
  t.is(min(el), false);
  el.value = '-11';
  t.is(min(el), false);
  el.value = '10.00001';
  t.is(min(el), true);
  el.value = '1e14';
  t.is(min(el), true);
});

test('validator-min for date', t => {
  var el = document.createElement('input');
  el.name = 'foo';
  el.type = 'date';
  el.setAttribute('min', '2015-01-01');
  el.value = '';
  t.is(min(el), true);
  el.value = '2015-01-01';
  t.is(min(el), true);
  el.value = '0000-01-01';
  t.is(min(el), false);
  el.value = '2000-02-29';
  t.is(min(el), false);
  el.value = '2014-12-33';
  t.is(min(el), true);
  el.value = '2015-01-02';
  t.is(min(el), true);
  el.value = '9999-12-31';
  t.is(min(el), true);
});
