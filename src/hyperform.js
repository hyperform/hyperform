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
import fixButtonEvents from './tools/fixButtonEvents';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form, {
                     debug=false,
                     strict=false,
                     prevent_implicit_submit=false,
                     revalidate,
                     valid_event,
                     extend_fieldset,
                     novalidate_on_elements,
                     classes,
                   }={}) {

  /* run this only, when we really create a Hyperform instance */
  fixButtonEvents();

  if (revalidate === undefined) {
    /* other recognized values: 'oninput', 'onblur', 'onsubmit' and 'never' */
    revalidate = strict? 'onsubmit' : 'hybrid';
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

  const settings = { debug, strict, prevent_implicit_submit, revalidate,
                     valid_event, extend_fieldset, classes, };

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

hyperform.set_language = lang => { set_language(lang); return hyperform; };
hyperform.add_translation = (lang, catalog) => { add_translation(lang, catalog); return hyperform; };
hyperform.set_renderer = (renderer, action) => { Renderer.set(renderer, action); return hyperform; };
hyperform.add_validator = (element, validator) => { CustomValidatorRegistry.set(element, validator); return hyperform; };
hyperform.set_message = (element, validator, message) => { custom_messages.set(element, validator, message); return hyperform; };
hyperform.add_hook = (hook, action, position) => { add_hook(hook, action, position); return hyperform; };
hyperform.remove_hook = (hook, action) => { remove_hook(hook, action); return hyperform; };

export default hyperform;
