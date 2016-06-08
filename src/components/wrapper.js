'use strict';


import { catch_submit, uncatch_submit } from '../tools/catch_submit';
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
import uninstall from '../tools/property_uninstaller';


const instances = new WeakMap();


/**
 * wrap <form>s, window or document, that get treated with the global
 * hyperform()
 */
export default class Wrapper {

  constructor(form, settings) {
    this.form = form;
    this.settings = settings;

    instances.set(form, this);

    catch_submit(form);

    if (form === window || form instanceof window.HTMLDocument) {
      /* install on the prototypes, when called for the whole document */
      this.install([
        window.HTMLButtonElement.prototype,
        window.HTMLInputElement.prototype,
        window.HTMLSelectElement.prototype,
        window.HTMLTextAreaElement.prototype,
        window.HTMLFieldSetElement.prototype,
      ]);
      this.install_form(window.HTMLFormElement);
    } else if (form instanceof window.HTMLFormElement ||
              form instanceof window.HTMLFieldSetElement) {
      this.install(form.elements);
      if (form instanceof window.HTMLFormElement) {
        this.install_form(form);
      }
    }

    if (settings.revalidate === 'oninput') {
      /* in a perfect world we'd just bind to "input", but support here is
       * abysmal: http://caniuse.com/#feat=input-event */
      form.addEventListener('keyup', this.revalidate);
      form.addEventListener('change', this.revalidate);
    }
  }

  destroy() {
    uncatch_submit(this.form);
    instances.delete(this.form);
    this.form.removeEventListener('keyup', this.revalidate);
    this.form.removeEventListener('change', this.revalidate);
    if (this.form === window || this.form instanceof window.HTMLDocument) {
      this.uninstall([
        window.HTMLButtonElement.prototype,
        window.HTMLInputElement.prototype,
        window.HTMLSelectElement.prototype,
        window.HTMLTextAreaElement.prototype,
        window.HTMLFieldSetElement.prototype,
      ]);
      uninstall(window.HTMLFormElement, 'checkValidity');
      uninstall(window.HTMLFormElement, 'reportValidity');
    } else if (this.form instanceof window.HTMLFormElement ||
              this.form instanceof window.HTMLFieldSetElement) {
      this.uninstall(this.form.elements);
      if (this.form instanceof window.HTMLFormElement) {
        uninstall(this.form, 'checkValidity');
        uninstall(this.form, 'reportValidity');
      }
    }
  }

  /**
   * revalidate an input element
   */
  revalidate(event) {
    if (event.target instanceof window.HTMLButtonElement ||
        event.target instanceof window.HTMLTextAreaElement ||
        event.target instanceof window.HTMLSelectElement ||
        event.target instanceof window.HTMLInputElement) {
      reportValidity(event.target);
    }
  }

  /**
   * install the polyfills on each given element
   *
   * If you add elements dynamically, you have to call install() on them
   * yourself:
   *
   * js> var form = hyperform(document.forms[0]);
   * js> document.forms[0].appendChild(input);
   * js> form.install(input);
   *
   * You can skip this, if you called hyperform on window or document.
   */
  install(els) {
    if (els instanceof window.HTMLElement) {
      els = [ els ];
    }

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
      install_properties(els[i]);
    }
  }

  /**
   * install necessary polyfills on HTML <form> elements
   */
  install_form(form) {
    checkValidity.install(form);
    reportValidity.install(form);
  }

  uninstall(els) {
    if (els instanceof window.HTMLElement) {
      els = [ els ];
    }

    const els_length = els.length;

    for (let i = 0; i < els_length; i++) {
      uninstall(els[i], 'checkValidity');
      uninstall(els[i], 'reportValidity');
      uninstall(els[i], 'setCustomValidity');
      uninstall(els[i], 'stepDown');
      uninstall(els[i], 'stepUp');
      uninstall(els[i], 'validationMessage');
      uninstall(els[i], 'ValidityState');
      uninstall(els[i], 'valueAsDate');
      uninstall(els[i], 'valueAsNumber');
      uninstall(els[i], 'willValidate');
      // TODO uninstall our versions of property getters
    }
  }

}

/**
 * try to get the appropriate wrapper for a specific element by looking up
 * its parent chain
 *
 * @return Wrapper | undefined
 */
export function get_wrapper(element) {
  var wrapped;

  if (element.form) {
    /* try a shortcut with the element's <form> */
    wrapped = instances.get(element.form);
  }

  /* walk up the parent nodes until document (including) */
  while (! wrapped && element) {
    wrapped = instances.get(element);
    element = element.parentNode;
  }

  if (! wrapped) {
    /* try the global instance, if exists. This may also be undefined. */
    wrapped = instances.get(window);
  }

  return wrapped;
}
