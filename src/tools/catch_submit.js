'use strict';


import reportValidity from '../polyfills/reportValidity';
import { text as text_types } from '../components/types';


/**
 * catch the events _prior_ to a form being submitted
 */
export default function(listening_node) {
  listening_node.addEventListener('click', function(event) {
    if (event.target.nodeName === 'INPUT' ||
        event.target.nodeName === 'BUTTON') {
      if (event.target.type === 'image' || event.target.type === 'submit') {
        if (event.target.form) {
          event.preventDefault();
          reportValidity(event.target.form);
        }
      }
    }
  }, {
    capture: true,
  });

  /* catch implicit submission */
  listening_node.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      if (event.target.nodeName === 'INPUT') {
        if (text_types.indexOf(event.target.type) > -1) {
          if (event.target.form) {
            event.preventDefault();
            reportValidity(event.target.form);
          }
        }
      }
    }
  }, {
    capture: true,
  });
}
