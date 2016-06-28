'use strict';


import trigger_event from './trigger_event';
import reportValidity from '../polyfills/reportValidity';
import { text as text_types } from '../components/types';
import { get_wrapper } from '../components/wrapper';


function submit_form_via(element) {
  /* apparently, the submit event is not triggered in most browsers on
   * the submit() method, so we do it manually here to model a natural
   * submit as closely as possible. */
  const submit_event = trigger_event(element.form, 'submit',
                                     { cancelable: true });
  if (! submit_event.defaultPrevented) {
    add_submit_field(element);
    element.form.submit();
    remove_submit_field(element);
  }
}


function add_submit_field(button) {
  /* if a submit button was clicked, add its name=value to the
   * submitted data. */
  if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
    const wrapper = get_wrapper(button.form) || {};
    var submit_helper = wrapper.submit_helper;
    if (submit_helper) {
      if (submit_helper.parentNode) {
        submit_helper.parentNode.removeChild(submit_helper);
      }
    } else {
      submit_helper = document.createElement('input');
      submit_helper.type = 'hidden';
      wrapper.submit_helper = submit_helper;
    }
    submit_helper.name = button.name;
    submit_helper.value = button.value;
    button.form.appendChild(submit_helper);
  }
}


function remove_submit_field(button) {
  if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
    const wrapper = get_wrapper(button.form) || {};
    const submit_helper = wrapper.submit_helper;
    if (submit_helper && submit_helper.parentNode) {
      submit_helper.parentNode.removeChild(submit_helper);
    }
  }
}


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
    submit_form_via(event.target);
  } else if (first_invalid) {
    /* focus the first invalid element, if validation went south */
    first_invalid.focus();
  }
}


/**
 * test if node is a submit button
 */
function is_submit_button(node) {
  return (
    /* must be an input or button element... */
    (node.nodeName === 'INPUT' ||
     node.nodeName === 'BUTTON') &&

    /* ...and have a submitting type */
    (node.type === 'image' || node.type === 'submit')
  );
}


/**
 * test, if the click event would trigger a submit
 */
function is_submitting_click(event) {
  return (
    /* prevented default: won't trigger a submit */
    ! event.defaultPrevented &&

    /* left button or middle button (submits in Chrome) */
    (! ('button' in event) ||
     event.button < 2) &&

    /* must be a submit button... */
    is_submit_button(event.target) &&

    /* if validation should be ignored, we're not interested anyhow */
    ! event.target.hasAttribute('formnovalidate') &&

    /* the button needs a form, that's going to be submitted */
    event.target.form &&

    /* again, if the form should not be validated, we're out of the game */
    ! event.target.form.hasAttribute('novalidate')
  );
}


/**
 * test, if the keypress event would trigger a submit
 */
function is_submitting_keypress(event) {
  return (
    /* prevented default: won't trigger a submit */
    ! event.defaultPrevented &&

    (
      (
        /* <Enter> was pressed... */
        event.keyCode === 13 &&

        /* ...on an <input> or <button> */
        (event.target.nodeName === 'INPUT') &&

        /* this is a standard text input field (not checkbox, ...) */
        text_types.indexOf(event.target.type) > -1
      ) || (
        /* or <Enter> or <Space> was pressed... */
        (event.keyCode === 13 ||
         event.keyCode === 32) &&

        /* ...on a submit button */
        is_submit_button(event.target)
      )
    ) &&

    /* there's a form... */
    event.target.form &&

    /* ...and the form allows validation */
    ! event.target.form.hasAttribute('novalidate')
  );
}


/**
 * catch explicit submission by click on a button
 */
function click_handler(event) {
  if (is_submitting_click(event)) {
    check(event);
  }
}


/**
 * catch explicit submission by click on a button, but circumvent validation
 */
function ignored_click_handler(event) {
  if (is_submitting_click(event)) {
    submit_form_via(event.target);
  }
}


/**
 * catch implicit submission by pressing <Enter> in some situations
 */
function keypress_handler(event) {
  if (is_submitting_keypress(event))  {
    /* check, that there is no submit button in the form. Otherwise
     * that should be clicked. */
    const el = event.target.form.elements.length;
    var submit;
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
 * catch implicit submission by pressing <Enter> in some situations, but circumvent validation
 */
function ignored_keypress_handler(event) {
  if (is_submitting_keypress(event))  {
    /* check, that there is no submit button in the form. Otherwise
     * that should be clicked. */
    const el = event.target.form.elements.length;
    var submit;
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
      submit_form_via(event.target);
    }
  }
}


/**
 * catch all relevant events _prior_ to a form being submitted
 *
 * @param bool ignore bypass validation, when an attempt to submit the
 *                    form is detected.
 */
export function catch_submit(listening_node, ignore=false) {
  if (ignore) {
    listening_node.addEventListener('click', ignored_click_handler);
    listening_node.addEventListener('keypress', ignored_keypress_handler);
  } else {
    listening_node.addEventListener('click', click_handler);
    listening_node.addEventListener('keypress', keypress_handler);
  }
}


/**
 * decommission the event listeners from catch_submit() again
 */
export function uncatch_submit(listening_node) {
  listening_node.removeEventListener('click', ignored_click_handler);
  listening_node.removeEventListener('keypress', ignored_keypress_handler);
  listening_node.removeEventListener('click', click_handler);
  listening_node.removeEventListener('keypress', keypress_handler);
}
