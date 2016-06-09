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
import { set_language, add_translation } from './components/localization';
import CustomValidatorRegistry from './components/registry';
import Renderer from './components/renderer';
import Wrapper from './components/wrapper';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form, {
                     strict=false,
                     revalidate,
                     valid_event,
                     extend_fieldset,
                     novalidate_on_elements,
                     classes,
                   }={}) {

  if (revalidate === undefined) {
    revalidate = strict? 'onsubmit' : 'oninput';
  }
  if (valid_event === undefined) {
    valid_event = ! strict;
  }
  if (extend_fieldset === undefined) {
    extend_fieldset = ! strict;
  }
  if (novalidate_on_elements === undefined) {
    novalidate_on_elements = ! strict;
  }
  if (! classes) {
    classes = {};
  }

  const settings = { strict, revalidate, valid_event, extend_fieldset, classes, };

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

hyperform.set_language = set_language;
hyperform.add_translation = add_translation;
hyperform.set_renderer = Renderer.set;
hyperform.register = CustomValidatorRegistry.set;
hyperform.set_message = custom_messages.set;

export default hyperform;
