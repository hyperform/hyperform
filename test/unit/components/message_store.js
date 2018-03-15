'use strict';

import test from 'ava';
import { message_store } from '../../../src/components/message_store';

test('message_store', t => {
  var msg = new String('hello from the tests');
  var el = document.createElement('input');

  el._original_setCustomValidity = function(_msg) {
    el._original_validationMessage = _msg;
  };

  // test chaining
  t.is(message_store.set(el, msg), message_store);
  t.true(msg.__hyperform);

  t.is(message_store.get(el), msg);
  t.true(message_store.delete(el));
  t.is(message_store.get(el).toString(), '');

  message_store.set(el, msg.toString());
  t.is(message_store.get(el).toString(), msg.toString());
  t.is(el._original_validationMessage, msg.toString());
});
