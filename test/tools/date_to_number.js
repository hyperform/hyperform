'use strict';

import test from 'ava';
import date_to_number from '../../src/tools/date_to_number';

test('date_to_number consume Date', t => {
  var date = new Date();
  var ndate = date.getTime();
  t.is(date_to_number(date), ndate);
});

test('date_to_number consume String', t => {
  var date = new Date();
  var ndate = date.getTime();
  var sdate = date.toISOString();
  t.is(date_to_number(sdate), ndate);
});

test('date_to_number start of epoch', t => {
  var date = new Date(0);
  t.is(date_to_number(date), 0);
  t.is(date_to_number('1970-01-01T00:00:00z'), 0);
});

test('date_to_number before epoch', t => {
  var date = new Date(-1);
  t.is(date_to_number(date), -1);
  t.is(date_to_number('1969-12-31T23:59:59z'), -1000);
});
