'use strict';


import { message_store } from '../components/message_store';


/**
 * set a custom validity message or delete it with an empty string
 */
export default function setCustomValidity(element, msg) {
  message_store.set(element, msg, true);
}
