'use strict';


import checkValidity from './polyfills/checkValidity';
import setCustomValidity from './polyfills/setCustomValidity';
import validationMessage from './polyfills/validationMessage';
import ValidityState from './polyfills/validityState';
import willValidate from './polyfills/willValidate';


/**
 * public hyperform interface:
 */
const hyperform = {

  checkValidity,

  setCustomValidity,

  validationMessage,

  ValidityState,

  willValidate,

  update_form(form) {
    const els = form.elements;
    const els_length = els.length;
    for (let i = 0; i < els_length; i++) {
      checkValidity.install(els[i]);
      setCustomValidity.install(els[i]);
      validationMessage.install(els[i]);
      ValidityState.install(els[i]);
      willValidate.install(els[i]);
    }
  },
};

window.hyperform = hyperform;
