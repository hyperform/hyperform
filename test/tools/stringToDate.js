'use strict';

import test from 'ava';
import stringToDate from '../../src/tools/stringToDate';

test('stringToDate', t => {
  t.is(+stringToDate('2015-01-01T01:23:45', 'datetime'),
       +(new Date(Date.UTC(2015, 0, 1, 1, 23, 45))));
  t.is(+stringToDate('2015-01-01', 'date'),
       +(new Date(Date.UTC(2015, 0, 1))));
  t.is(+stringToDate('2015-01', 'month'),
       +(new Date(Date.UTC(2015, 0, 1))));
  t.is(+stringToDate('2015-W01', 'week'),
       +(new Date(Date.UTC(2014, 11, 29))));
  t.is(+stringToDate('01:23:45', 'time'),
       +(new Date(Date.UTC(1970, 0, 1, 1, 23, 45))));
  t.is(stringToDate('bar', 'datetime'), null);
  t.is(stringToDate('foo', 'time'), null);
  t.is(stringToDate('2015-01-01', 'text'), null);
});
