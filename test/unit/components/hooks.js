'use strict';

import test from 'ava';
import { add_hook, call_hook, do_filter, remove_hook, add_filter, remove_filter } from '../../../src/components/hooks';

test('hooks', t => {
  var called = false;
  add_hook('hooks1', arg => called = arg);
  var result = call_hook('hooks1', 1);
  t.is(called, 1);
  t.is(result, 1);
});

test('hooks this-value', t => {
  var this_is_set = false;
  add_hook('hooks2', arg => arg);
  add_hook('hooks2', function() {
    if (this.state === 2 && this.hook === 'hooks2') {
      this_is_set = true;
    }
  });
  call_hook('hooks2', 2);
  t.true(this_is_set);
});

test('hooks remove hook', t => {
  var called = false;
  const func = arg => called = arg;
  add_hook('hooks3', func);
  remove_hook('hooks3', func);
  var result = call_hook('hooks3', 1);
  t.is(called, false);
});

test('hooks filter value', t => {
  const func = () => undefined;
  add_filter('hooks4', func);
  t.is(do_filter('hooks4', 1), 1);
  t.is(do_filter('hooks4', false), false);
  t.is(do_filter('hooks4', 'abc'), 'abc');
  t.is(do_filter('hooks4', func), func);
  add_filter('hooks4', x => x? 'y' : 'n');
  t.is(do_filter('hooks4', true), 'y');
  t.is(do_filter('hooks4', false), 'n');
});
