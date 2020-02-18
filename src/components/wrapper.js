'use strict';


const instances = new WeakMap();


/**
 * wrap <form>s, window or document, that get treated with the global
 * hyperform()
 */
export default function Wrapper(form, settings) {

  /* do not allow more than one instance per form. Otherwise we'd end
   * up with double event handlers, polyfills re-applied, ... */
  var existing = instances.get(form);
  if (existing) {
    existing.settings = settings;
    return existing;
  }

  this.form = form;
  this.settings = settings;
  this.observer = null;

  instances.set(form, this);
}


Wrapper.prototype = {
  destroy() {
    instances.delete(this.form);
    if (this._destruct) {
      this._destruct();
    }
  },
};


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
