'use strict';

import test from 'ava';
import messageStore from '../../src/components/messageStore';

test('messageStore', t => {
  var testMsg = new String('hello from the tests');
  var el = document.createElement('input');

  el._original_setCustomValidity = function(msg) {
    el._original_validationMessage = msg;
  };

  // test chaining
  t.is(messageStore.set(el, testMsg), messageStore);
  t.true(testMsg.__hyperform);

  t.is(messageStore.get(el), testMsg);
  t.true(messageStore.delete(el));
  t.is(messageStore.get(el).toString(), '');

  messageStore.set(el, testMsg.toString());
  t.is(messageStore.get(el).toString(), testMsg.toString());
  t.is(el._original_validationMessage, testMsg.toString());
});
