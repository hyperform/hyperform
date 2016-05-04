'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import message_store from '../components/message_store';


/**
 * TODO allow HTMLFieldSetElement, too
 */
function validationMessage() {
  /* jshint -W040 */
  const msg = message_store.get(this);
  /* jshint +W040 */
  if (! msg) {
    return '';
  }

  /* make it a primitive again, since message_store returns String(). */
  return msg.toString();
}


/**
 * publish a convenience function to replace the native element.validationMessage
 */
validationMessage.install = installer('validationMessage', {
  configurable: true,
  enumerable: true,
  get: validationMessage,
  set: undefined,
});

mark(validationMessage);

export default validationMessage;
