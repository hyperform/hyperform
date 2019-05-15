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
import custom_messages from './components/custom_messages';
import { add_hook, remove_hook } from './components/hooks';
import { set_language, add_translation } from './components/localization';
import CustomValidatorRegistry from './components/registry';
import Renderer from './components/renderer';
import Wrapper from './components/wrapper';
import sprintf from './tools/sprintf';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form, {
                     classes,
                     debug=false,
                     extendFieldset,
                     novalidateOnElements,
                     preventImplicitSubmit=false,
                     revalidate,
                     strict=false,
                     validEvent,
                     validateNameless=false,
                   }={}) {

  if (! classes) {
    classes = {};
  }
  // TODO: clean up before next non-patch release
  if (extendFieldset === undefined) {
    extendFieldset = ! strict;
  }
  if (novalidateOnElements === undefined) {
    novalidateOnElements = ! strict;
  }
  if (preventImplicitSubmit === undefined) {
    preventImplicitSubmit = false;
  }
  if (revalidate === undefined) {
    /* other recognized values: 'oninput', 'onblur', 'onsubmit' and 'never' */
    revalidate = strict? 'onsubmit' : 'hybrid';
  }
  if (validEvent === undefined) {
    validEvent = ! strict;
  }

  const settings = { debug, strict, preventImplicitSubmit, revalidate,
                     validEvent, extendFieldset, classes, novalidateOnElements,
                     validateNameless,
                   };

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

hyperform.setLanguage = lang => { set_language(lang); return hyperform; };
hyperform.addTranslation = (lang, catalog) => { add_translation(lang, catalog); return hyperform; };
hyperform.setRenderer = (renderer, action) => { Renderer.set(renderer, action); return hyperform; };
hyperform.addValidator = (element, validator) => { CustomValidatorRegistry.set(element, validator); return hyperform; };
hyperform.setMessage = (element, validator, message) => { custom_messages.set(element, validator, message); return hyperform; };
hyperform.addHook = (hook, action, position) => { add_hook(hook, action, position); return hyperform; };
hyperform.removeHook = (hook, action) => { remove_hook(hook, action); return hyperform; };

if (document.currentScript && document.currentScript.hasAttribute('data-hf-autoload')) {
  hyperform(window);
}

export default hyperform;
