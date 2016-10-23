'use strict';


import messageStore from '../components/messageStore';


/**
 * set a custom validity message or delete it with an empty string
 */
export default function setCustomValidity(element, msg) {
  messageStore.set(element, msg, true);
}
