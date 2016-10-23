'use strict';

import test from 'ava';
import { addHook, callHook, doFilter, removeHook, addFilter, removeFilter } from '../../src/components/hooks';

test('hooks', t => {
  var called = false;
  addHook('hooks1', arg => called = arg);
  var result = callHook('hooks1', 1);
  t.is(called, 1);
  t.is(result, 1);
});

test('hooks this-value', t => {
  var thisIsSet = false;
  addHook('hooks2', arg => arg);
  addHook('hooks2', function() {
    if (this.state === 2 && this.hook === 'hooks2') {
      thisIsSet = true;
    }
  });
  callHook('hooks2', 2);
  t.true(thisIsSet);
});

test('hooks remove hook', t => {
  var called = false;
  const func = arg => called = arg;
  addHook('hooks3', func);
  removeHook('hooks3', func);
  var result = callHook('hooks3', 1);
  t.is(called, false);
});

test('hooks filter value', t => {
  const func = () => undefined;
  addFilter('hooks4', func);
  t.is(doFilter('hooks4', 1), 1);
  t.is(doFilter('hooks4', false), false);
  t.is(doFilter('hooks4', 'abc'), 'abc');
  t.is(doFilter('hooks4', func), func);
  addFilter('hooks4', x => x? 'y' : 'n');
  t.is(doFilter('hooks4', true), 'y');
  t.is(doFilter('hooks4', false), 'n');
});
