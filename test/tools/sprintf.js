'use strict';

import test from 'ava';
import sprintf from '../../src/tools/sprintf';

test('sprintf replace single argument', t => {
  t.is(sprintf('a%sc', 'b'), 'abc');
  t.is(sprintf('a%1$sc', 'b'), 'abc');
});

test('sprintf replace two arguments', t => {
  t.is(sprintf('a%sc%se', 'b', 'd'), 'abcde');
  t.is(sprintf('a%2$sc%1$se', 'b', 'd'), 'adcbe');
});

test('sprintf replace number', t => {
  var num = 12.34;
  var snum = (num.toLocaleString || num.toString).call(num);
  t.is(sprintf('a%sb', num), 'a'+snum+'b');
});

test.skip('sprintf replace date', t => {
  var date = new Date();
  var sdate = (date.toLocaleString || date.toString).call(date);
  t.is(sprintf('a%sb', date), 'a'+sdate+'b');
});
