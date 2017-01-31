'use strict';

import test from 'ava';
import registry from '../../../src/components/registry';

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

test('registry', t => {
  var second_called = false;
  var el = get([]);
  var validator1 = function(element) {};
  var validator2 = function(element) { second_called = true; };

  t.true(Array.isArray(registry.get(el)));
  registry.set(el, validator1);
  t.is(registry.get(el)[0], validator1);
  t.is(registry.get(el).length, 1);

  registry.set(el, validator2);
  t.is(registry.get(el)[0], validator1);
  t.is(registry.get(el)[1], validator2);
  t.is(registry.get(el).length, 2);

  /* make sure the functions don't get called underway */
  t.is(second_called, false);
});
