'use strict';


import install_property from '../tools/property_installer';

import checkValidity from '../polyfills/checkValidity';
import reportValidity from '../polyfills/reportValidity';
import setCustomValidity from '../polyfills/setCustomValidity';
import stepDown from '../polyfills/stepDown';
import stepUp from '../polyfills/stepUp';
import validationMessage from '../polyfills/validationMessage';
import ValidityState from '../polyfills/validityState';
import valueAsDate from '../polyfills/valueAsDate';
import valueAsNumber from '../polyfills/valueAsNumber';
import willValidate from '../polyfills/willValidate';
import { install_properties } from '../polyfills/properties';


export default function(element) {
  if (element instanceof window.HTMLButtonElement ||
      element instanceof window.HTMLInputElement ||
      element instanceof window.HTMLSelectElement ||
      element instanceof window.HTMLTextAreaElement ||
      element instanceof window.HTMLFieldSetElement) {

    install_property(element, 'checkValidity', {
      value: function() { return checkValidity(this); },
    });
    install_property(element, 'reportValidity', {
      value: function() { return reportValidity(this); },
    });
    install_property(element, 'setCustomValidity', {
      value: function (msg) { return setCustomValidity(this, msg); },
    });
    install_property(element, 'stepDown', {
      value: function(n=1) { return stepDown(this, n); },
    });
    install_property(element, 'stepUp', {
      value: function(n=1) { return stepUp(this, n); },
    });
    install_property(element, 'validationMessage', {
      get: function() { return validationMessage(this); },
    });
    install_property(element, 'validity', {
      get: function() { return ValidityState(this); },
    });
    install_property(element, 'valueAsDate', {
      get: function() { return valueAsDate(this); },
      set: function(value) { valueAsDate(this, value); },
    });
    install_property(element, 'valueAsNumber', {
      get: function() { return valueAsNumber(this); },
      set: function(value) { valueAsNumber(this, value); },
    });
    install_property(element, 'willValidate', {
      get: function() { return willValidate(this); },
    });

    install_properties;

  } else if (element instanceof window.HTMLFormElement) {
    install_property(element, 'checkValidity', {
      value: function() { return checkValidity(this); },
    });
    install_property(element, 'reportValidity', {
      value: function() { return reportValidity(this); },
    });
  }
}
