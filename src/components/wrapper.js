'use strict';


const instances = new WeakMap();


export default class Wrapper {

  constructor(form, settings) {
    this.form = form;
    this.settings = settings || {};
    instances.set(form, this);
  }

  /* try to get the appropriate wrapper for a specific element by looking up
   * its parent chain */
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
