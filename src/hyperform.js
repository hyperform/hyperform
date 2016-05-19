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
import { set_language, add_translation } from './components/localization';
import Registry from './components/registry';
import Renderer from './components/renderer';
import Wrapper from './components/wrapper';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form, {
                     strict=false,
                     revalidate='oninput',
                     valid_event=true,
                   }={}) {
  if (form instanceof window.NodeList ||
      form instanceof window.HTMLCollection ||
      form instanceof Array) {
    return Array.prototype.map.call(form, element => hyperform(element));
  }

  return new Wrapper(form, { strict, revalidate, valid_event, });
}

/* publish globally */
exports = hyperform;
/* jspm will place these on the above "exports" variable */
let set_renderer = Renderer.set;
let register = Registry.set;
export {
  version,
  checkValidity,
  reportValidity,
  setCustomValidity,
  stepDown,
  stepUp,
  validationMessage,
  ValidityState,
  valueAsDate,
  valueAsNumber,
  willValidate,

  set_language,
  add_translation,
  set_renderer,
  register,
};
