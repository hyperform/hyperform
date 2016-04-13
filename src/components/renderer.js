'use strict';


import message_store from './message_store';


const Renderer = {

  show_warning: function(element) {
    const msg = message_store.get(element);
    if (msg) {
      window.alert(msg);
    }
  },

  set: function(renderer, action) {
    Renderer[renderer] = action;
  },

};


export default Renderer;
