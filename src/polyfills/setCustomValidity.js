'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import message_store from '../components/message_store';


/**
 *
 */
function setCustomValidity(msg) {
  /* jshint -W040 */
  message_store.set(this, msg, true);
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

mark(setCustomValidity);

export default setCustomValidity;
