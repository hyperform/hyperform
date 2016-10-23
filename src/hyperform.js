'use strict';


import checkValidity from './polyfills/checkValidity';
import reportValidity from './polyfills/reportValidity';
import setCustomValidity from './polyfills/setCustomValidity';
import stepDown from './polyfills/stepDown';
import stepUp from './polyfills/stepUp';
import validationMessage from './polyfills/validationMessage';
import ValidityState from './polyfills/validityState';
import valueAsDate from './polyfills/valueAsDate';
import valueAsNumber from './polyfills/valueAsNumber';
import willValidate from './polyfills/willValidate';
import customMessages from './components/customMessages';
import { addHook, removeHook } from './components/hooks';
import { setLanguage, addTranslation } from './components/localization';
import CustomValidatorRegistry from './components/registry';
import Renderer from './components/renderer';
import Wrapper from './components/wrapper';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form, {
                     strict=false,
                     preventImplicitSubmit=false,
                     revalidate,
                     validEvent,
                     extendFieldset,
                     novalidateOnElements,
                     classes,
                   }={}) {

  if (revalidate === undefined) {
    /* other recognized values: 'oninput', 'onblur', 'onsubmit' and 'never' */
    revalidate = strict? 'onsubmit' : 'hybrid';
  }
  if (validEvent === undefined) {
    validEvent = ! strict;
  }
  if (extendFieldset === undefined) {
    extendFieldset = ! strict;
  }
  if (novalidateOnElements === undefined) {
    novalidateOnElements = ! strict;
  }
  if (! classes) {
    classes = {};
  }

  const settings = { strict, preventImplicitSubmit, revalidate, validEvent,
                     extendFieldset, classes, };

  if (form instanceof window.NodeList ||
      form instanceof window.HTMLCollection ||
      form instanceof Array) {
    return Array.prototype.map.call(form,
                                    element => hyperform(element, settings));
  }

  return new Wrapper(form, settings);
}

hyperform.version = version;

hyperform.checkValidity = checkValidity;
hyperform.reportValidity = reportValidity;
hyperform.setCustomValidity = setCustomValidity;
hyperform.stepDown = stepDown;
hyperform.stepUp = stepUp;
hyperform.validationMessage = validationMessage;
hyperform.ValidityState = ValidityState;
hyperform.valueAsDate = valueAsDate;
hyperform.valueAsNumber = valueAsNumber;
hyperform.willValidate = willValidate;

hyperform.setLanguage = lang => { setLanguage(lang); return hyperform; };
hyperform.addTranslation = (lang, catalog) => { addTranslation(lang, catalog); return hyperform; };
hyperform.setRenderer = (renderer, action) => { Renderer.set(renderer, action); return hyperform; };
hyperform.addValidator = (element, validator) => { CustomValidatorRegistry.set(element, validator); return hyperform; };
hyperform.setMessage = (element, validator, message) => { customMessages.set(element, validator, message); return hyperform; };
hyperform.addHook = (hook, action, position) => { addHook(hook, action, position); return hyperform; };
hyperform.removeHook = (hook, action) => { removeHook(hook, action); return hyperform; };

export default hyperform;
