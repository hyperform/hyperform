'use strict';


import mark from '../tools/mark';
import installer from '../tools/property_installer';
import message_store from '../components/message_store';


/**
 *
 */
function setCustomValidity(element, msg) {
  message_store.set(element, msg, true);
}


/**
 * publish a convenience function to replace the native element.setCustomValidity
 */
setCustomValidity.install = installer('setCustomValidity', {
  value: function (msg) { return setCustomValidity(this, msg); },
  writable: true,
});

mark(setCustomValidity);

export default setCustomValidity;
