'use strict';


import catch_submit from './tools/catch_submit';
import checkValidity from './polyfills/checkValidity';
import reportValidity from './polyfills/reportValidity';
import setCustomValidity from './polyfills/setCustomValidity';
import validationMessage from './polyfills/validationMessage';
import ValidityState from './polyfills/validityState';
import valueAsDate from './polyfills/valueAsDate';
import valueAsNumber from './polyfills/valueAsNumber';
import willValidate from './polyfills/willValidate';
import { set_language, add_translation } from './components/localization';
import Renderer from './components/renderer';
import version from './version';


/**
 * public hyperform interface:
 */
const hyperform = {

  version,

  checkValidity,

  reportValidity,

  setCustomValidity,

  validationMessage,

  ValidityState,

  valueAsDate,

  valueAsNumber,

  willValidate,

  set_language,

  add_translation,

  add_renderer: Renderer.set,

  capture(form) {
    var els;
    if (form === window || form instanceof window.HTMLDocument) {
      /* install on the prototypes, when called for the document */
      els = [
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
      validationMessage.install(els[i]);
      ValidityState.install(els[i]);
      valueAsDate.install(els[i]);
      valueAsNumber.install(els[i]);
      willValidate.install(els[i]);
    }
  },

};

window.hyperform = hyperform;
