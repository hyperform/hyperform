'use strict';

import test from 'ava';
import custom_messages from '../../../src/components/custom_messages';
import ValidityState from '../../../src/polyfills/validityState';
import validationMessage from '../../../src/polyfills/validationMessage';

test('custom_messages', t => {
  var msg = 'hello from the tests';
  var el = document.createElement('input');
  el.name = 'foo';
  el.required = true;

  custom_messages.set(el, 'valueMissing', msg);
  t.is(custom_messages.get(el, 'valueMissing'), msg);

  t.true(ValidityState(el).valueMissing);
  t.is(validationMessage(el), msg);
});
