'use strict';


import mark from '../tools/mark';
import message_store from '../components/message_store';


/**
 * get the validation message for an element, empty string, if the element
 * satisfies all constraints.
 */
function validationMessage(element) {
  const msg = message_store.get(element);
  if (! msg) {
    return '';
  }

  /* make it a primitive again, since message_store returns String(). */
  return msg.toString();
}

mark(validationMessage);

export default validationMessage;
