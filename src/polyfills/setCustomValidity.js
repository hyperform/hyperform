'use strict';


import installer from '../tools/property_installer';
import message_store from '../components/message_store';


/**
 * TODO allow HTMLFieldSetElement, too
 */
function setCustomValidity(msg) {
  msg.is_custom = true;
  /* jshint -W040 */
  message_store.set(this, msg);
  /* jshint +W040 */
}


/**
 * publish a convenience function to replace the native element.setCustomValidity
 */
setCustomValidity.install = installer('setCustomValidity', {
  configurable: true,
  enumerable: true,
  get: setCustomValidity,
  set: undefined,
});


export default setCustomValidity;
