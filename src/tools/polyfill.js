'use strict';


import install_property from './property_installer';
import is_field from './is_field';
import mark from './mark';

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


const polyfills = {
    checkValidity: {
      value: mark(function() { return checkValidity(this); }),
    },
    reportValidity: {
      value: mark(function() { return reportValidity(this); }),
    },
    setCustomValidity: {
      value: mark(function (msg) { return setCustomValidity(this, msg); }),
    },
    stepDown: {
      value: mark(function(n=1) { return stepDown(this, n); }),
    },
    stepUp: {
      value: mark(function(n=1) { return stepUp(this, n); }),
    },
    validationMessage: {
      get: mark(function() { return validationMessage(this); }),
    },
    validity: {
      get: mark(function() { return ValidityState(this); }),
    },
    valueAsDate: {
      get: mark(function() { return valueAsDate(this); }),
      set: mark(function(value) { valueAsDate(this, value); }),
    },
    valueAsNumber: {
      get: mark(function() { return valueAsNumber(this); }),
      set: mark(function(value) { valueAsNumber(this, value); }),
    },
    willValidate: {
      get: mark(function() { return willValidate(this); }),
    },
};

export default function(element) {
  if (is_field(element)) {

    for (let prop in polyfills) {
      install_property(element, prop, polyfills[prop]);
    }

    install_properties(element);

  } else if (element instanceof window.HTMLFormElement ||
             element === window.HTMLFormElement.prototype) {
    install_property(element, 'checkValidity', polyfills.checkValidity);
    install_property(element, 'reportValidity', polyfills.reportValidity);
  }
}
