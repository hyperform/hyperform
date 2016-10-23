'use strict';

import test from 'ava';
import dateToString from '../../src/tools/dateToString';

test('dateToString', t => {
  t.is('2015-01-01T01:23:45',
       dateToString(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'datetime'));
  t.is('2015-01-01',
       dateToString(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'date'));
  t.is('2015-01',
       dateToString(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'month'));
  t.is('2015-W01',
       dateToString(new Date(Date.UTC(2015, 0, 1, 1, 23, 45)), 'week'));
  t.is(dateToString('bar', 'datetime'), null);
  t.is(dateToString('foo', 'time'), null);
  t.is(dateToString('2015-01-01', 'text'), null);
});
