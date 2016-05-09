'use strict';


import checkValidity from '../polyfills/checkValidity';


const instances = new WeakMap();


export default class Wrapper {

  constructor(form, settings) {
    this.form = form;
    this.settings = settings || {};
    instances.set(form, this);

    if (settings.revalidate === 'oninput') {
      /* in a perfect world we'd just bind to "input", but support here is
       * abysmal: http://caniuse.com/#feat=input-event */
      form.addEventListener('keyup', this.revalidate.bind(this));
      form.addEventListener('change', this.revalidate.bind(this));
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
      checkValidity(event.target);
    }
  }

  /**
   * try to get the appropriate wrapper for a specific element by looking up
   * its parent chain
   */
  static get_wrapped(element) {
    var wrapped;
    while (! wrapped && element) {
      wrapped = instances.get(element);
      element = element.parentNode;
    }

    if (! wrapped) {
      /* this may also be undefined. */
      wrapped = instances.get(window);
    }

    return wrapped;
  }

}
