'use strict';


import messageStore from '../components/messageStore';


/**
 * get the validation message for an element, empty string, if the element
 * satisfies all constraints.
 */
export default function validationMessage(element) {
  const msg = messageStore.get(element);
  if (! msg) {
    return '';
  }

  /* make it a primitive again, since messageStore returns String(). */
  return msg.toString();
}
