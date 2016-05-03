'use strict';


import message_store from './message_store';


const warnings_cache = new WeakMap();


const Renderer = {

  show_warning: function(element) {
    const msg = message_store.get(element);
    var warning = warnings_cache.get(element);
    if (msg) {
      if (! warning) {
        warning = document.createElement('div');
        warning.className = 'hf-warning';
        warnings_cache.set(element, warning);
      }
      warning.textContent = msg;
      /* should also work, if element is last,
       * http://stackoverflow.com/a/4793630/113195 */
      element.parentNode.insertBefore(warning, element.nextSibling);
    } else if (warning && warning.parentNode) {
      warning.parentNode.removeChild(warning);
    }
  },

  set: function(renderer, action) {
    Renderer[renderer] = action;
  },

};


export default Renderer;
