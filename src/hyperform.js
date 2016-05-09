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

hyperform.set_language = set_language;
hyperform.add_translation = add_translation;
hyperform.add_renderer = Renderer.set;
hyperform.register = Registry.set;

/* publish globally */
window.hyperform = hyperform;
