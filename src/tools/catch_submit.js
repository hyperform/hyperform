'use strict';


import trigger_event from './trigger_event';
import reportValidity from '../polyfills/reportValidity';
import { text as text_types } from '../components/types';


function check(event) {
  event.preventDefault();

  /* trigger a "validate" event on the form to be submitted */
  const val_event = trigger_event(event.target.form, 'validate',
                                  { cancelable: true });
  if (val_event.defaultPrevented) {
    /* skip the whole submit thing, if the validation is canceled. A user
     * can still call form.submit() afterwards. */
    return;
  }

  var valid = true;
  var first_invalid;
  Array.prototype.map.call(event.target.form.elements, element => {
    if (! reportValidity(element)) {
      valid = false;
      if (! first_invalid && ('focus' in element)) {
        first_invalid = element;
      }
    }
  });

  if (valid) {
    /* apparently, the submit event is not triggered in most browsers on
     * the submit() method, so we do it manually here to model a natural
     * submit as closely as possible. */
    const submit_event = trigger_event(event.target.form, 'submit',
                                       { cancelable: true });
    if (! submit_event.defaultPrevented) {
      event.target.form.submit();
    }
  } else if (first_invalid) {
    /* focus the first invalid element, if validation went south */
    first_invalid.focus();
  }
}


/**
 * catch explicit submission by click on a button
 */
function click_handler(event) {
  if (! event.defaultPrevented &&

      (event.target.nodeName === 'INPUT' ||
       event.target.nodeName === 'BUTTON') &&

      (event.target.type === 'image' || event.target.type === 'submit') &&

      ! event.target.hasAttribute('formnovalidate') &&

      event.target.form &&

      ! event.target.form.hasAttribute('novalidate')) {

    check(event);
  }
}


/**
 * catch implicit submission by pressing <Enter> in some situations
 */
function keypress_handler(event) {
  if (! event.defaultPrevented &&

      event.keyCode === 13 &&

      event.target.nodeName === 'INPUT' &&

      text_types.indexOf(event.target.type) > -1 &&

      event.target.form &&

      ! event.target.form.hasAttribute('novalidate')) {

    /* check, that there is no submit button in the form. Otherwise
     * that should be clicked. */
    var submit, el = event.target.form.elements.length;
    for (let i = 0; i < el; i++) {
      if (['image', 'submit'].indexOf(event.target.form.elements[i].type) > -1) {
        submit = event.target.form.elements[i];
        break;
      }
    }

    if (submit) {
      event.preventDefault();
      submit.click();
    } else {
      check(event);
    }
  }
}


/**
 * catch all relevant events _prior_ to a form being submitted
 */
export function catch_submit(listening_node) {
  listening_node.addEventListener('click', click_handler);
  listening_node.addEventListener('keypress', keypress_handler);
}


/**
 * decommission the event listeners again
 */
export function uncatch_submit(listening_node) {
  listening_node.removeEventListener('click', click_handler);
  listening_node.removeEventListener('keypress', keypress_handler);
}
