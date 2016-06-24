'use strict';


import { catch_submit, uncatch_submit } from '../tools/catch_submit';
import reportValidity from '../polyfills/reportValidity';
import uninstall from '../tools/property_uninstaller';
import polyfill from '../tools/polyfill';
import polyunfill from '../tools/polyunfill';


const instances = new WeakMap();


/**
 * wrap <form>s, window or document, that get treated with the global
 * hyperform()
 */
export default class Wrapper {

  constructor(form, settings) {
    this.form = form;
    this.settings = settings;
    this.revalidator = this.revalidate.bind(this);

    instances.set(form, this);

    catch_submit(form, settings.revalidate === 'never');

    if (form === window || form instanceof window.HTMLDocument) {
      /* install on the prototypes, when called for the whole document */
      this.install([
        window.HTMLButtonElement.prototype,
        window.HTMLInputElement.prototype,
        window.HTMLSelectElement.prototype,
        window.HTMLTextAreaElement.prototype,
        window.HTMLFieldSetElement.prototype,
      ]);
      polyfill(window.HTMLFormElement);
    } else if (form instanceof window.HTMLFormElement ||
               form instanceof window.HTMLFieldSetElement) {
      this.install(form.elements);
      if (form instanceof window.HTMLFormElement) {
        polyfill(form);
      }
    }

    if (settings.revalidate === 'oninput' || settings.revalidate === 'hybrid') {
      /* in a perfect world we'd just bind to "input", but support here is
       * abysmal: http://caniuse.com/#feat=input-event */
      form.addEventListener('keyup', this.revalidator);
      form.addEventListener('change', this.revalidator);
    }
    if (settings.revalidate === 'onblur' || settings.revalidate === 'hybrid') {
      /* useCapture=true, because `blur` doesn't bubble. See
       * https://developer.mozilla.org/en-US/docs/Web/Events/blur#Event_delegation
       * for a discussion */
      form.addEventListener('blur', this.revalidator, true);
    }
  }

  destroy() {
    uncatch_submit(this.form);
    instances.delete(this.form);
    this.form.removeEventListener('keyup', this.revalidator);
    this.form.removeEventListener('change', this.revalidator);
    this.form.removeEventListener('blur', this.revalidator, true);
    if (this.form === window || this.form instanceof window.HTMLDocument) {
      this.uninstall([
        window.HTMLButtonElement.prototype,
        window.HTMLInputElement.prototype,
        window.HTMLSelectElement.prototype,
        window.HTMLTextAreaElement.prototype,
        window.HTMLFieldSetElement.prototype,
      ]);
      polyunfill(window.HTMLFormElement);
    } else if (this.form instanceof window.HTMLFormElement ||
               this.form instanceof window.HTMLFieldSetElement) {
      this.uninstall(this.form.elements);
      if (this.form instanceof window.HTMLFormElement) {
        polyunfill(this.form);
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

      if (this.settings.revalidate === 'hybrid') {
        /* "hybrid" somewhat simulates what browsers do. See for example
         * Firefox's :-moz-ui-invalid pseudo-class:
         * https://developer.mozilla.org/en-US/docs/Web/CSS/:-moz-ui-invalid */
        if (event.type === 'blur' &&
            event.target.value !== event.target.defaultValue ||
            event.target.validity.valid) {
          /* on blur, update the report when the value has changed from the
           * default or when the element is valid (possibly removing a still
           * standing invalidity report). */
          reportValidity(event.target);
        } else if (event.type === 'keyup' || event.type === 'change') {
          if (event.target.validity.valid) {
            // report instantly, when an element becomes valid,
            // postpone report to blur event, when an element is invalid
            reportValidity(event.target);
          }
        }

      } else {
        reportValidity(event.target);
      }

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
    if (els instanceof window.Element) {
      els = [ els ];
    }

    const els_length = els.length;

    for (let i = 0; i < els_length; i++) {
      polyfill(els[i]);
    }
  }

  uninstall(els) {
    if (els instanceof window.Element) {
      els = [ els ];
    }

    const els_length = els.length;

    for (let i = 0; i < els_length; i++) {
      polyunfill(els[i]);
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
