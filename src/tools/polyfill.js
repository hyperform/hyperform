'use strict';


import installProperty from './propertyInstaller';
import isField from './isField';
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
import { installProperties } from '../polyfills/properties';


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
  if (isField(element)) {

    for (let prop in polyfills) {
      installProperty(element, prop, polyfills[prop]);
    }

    installProperties(element);

  } else if (element instanceof window.HTMLFormElement ||
             element === window.HTMLFormElement.prototype) {
    installProperty(element, 'checkValidity', polyfills.checkValidity);
    installProperty(element, 'reportValidity', polyfills.reportValidity);
  }
}
