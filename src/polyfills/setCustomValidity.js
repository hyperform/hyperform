'use strict';


import mark from '../tools/mark';
import message_store from '../components/message_store';


/**
 *
 */
function setCustomValidity(element, msg) {
  message_store.set(element, msg, true);
}

mark(setCustomValidity);

export default setCustomValidity;
