'use strict';


import catch_submit from './tools/catch_submit';
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
import Renderer from './components/renderer';
import Wrapper from './components/wrapper';
import version from './version';


/**
 * public hyperform interface:
 */
function hyperform(form) {
  if (form instanceof window.NodeList ||
      form instanceof window.HTMLCollection ||
      form instanceof Array) {
    return Array.prototype.map.call(form, element => hyperform(element));
  }

  var els;
  if (form === window || form instanceof window.HTMLDocument) {
    /* install on the prototypes, when called for the document */
    els = [
      window.HTMLButtonElement.prototype,
      window.HTMLInputElement.prototype,
      window.HTMLSelectElement.prototype,
      window.HTMLTextAreaElement.prototype,
      window.HTMLFieldSetElement.prototype,
    ];
  } else if (form instanceof window.HTMLFormElement ||
             form instanceof window.HTMLFieldSetElement) {
    els = form.elements;
  }

  catch_submit(form);

  const els_length = els.length;
  for (let i = 0; i < els_length; i++) {
    checkValidity.install(els[i]);
    reportValidity.install(els[i]);
    setCustomValidity.install(els[i]);
    stepDown.install(els[i]);
    stepUp.install(els[i]);
    validationMessage.install(els[i]);
    ValidityState.install(els[i]);
    valueAsDate.install(els[i]);
    valueAsNumber.install(els[i]);
    willValidate.install(els[i]);
  }

  return new Wrapper(form);
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

window.hyperform = hyperform;
