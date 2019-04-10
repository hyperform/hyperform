'use strict';


import trigger_event, { create_event } from './trigger_event';
import matches from './matches';
import { get_validated_elements } from './get_validated_elements';
import reportValidity from '../polyfills/reportValidity';
import { text as text_types } from '../components/types';
import { get_wrapper } from '../components/wrapper';


/**
 * submit a form, because `element` triggered it
 *
 * This method also dispatches a submit event on the form prior to the
 * submission. The event contains the trigger element as `submittedVia`.
 *
 * If the element is a button with a name, the name=value pair will be added
 * to the submitted data.
 */
function submit_form_via(element) {
  /* apparently, the submit event is not triggered in most browsers on
   * the submit() method, so we do it manually here to model a natural
   * submit as closely as possible.
   * Now to the fun fact: If you trigger a submit event from a form, what
   * do you think should happen?
   * 1) the form will be automagically submitted by the browser, or
   * 2) nothing.
   * And as you already suspected, the correct answer is: both! Firefox
   * opts for 1), Chrome for 2). Yay! */
  var event_got_cancelled;

  var submit_event = create_event('submit', { cancelable: true });
  /* force Firefox to not submit the form, then fake preventDefault() */
  submit_event.preventDefault();
  Object.defineProperty(submit_event, 'defaultPrevented', {
    value: false,
    writable: true,
  });
  Object.defineProperty(submit_event, 'preventDefault', {
    value: () => submit_event.defaultPrevented = event_got_cancelled = true,
    writable: true,
  });
  trigger_event(element.form, submit_event, {}, { submittedVia: element });

  if (! event_got_cancelled) {
    add_submit_field(element);
    window.HTMLFormElement.prototype.submit.call(element.form);
    window.setTimeout(() => remove_submit_field(element));
  }
}


/**
 * if a submit button was clicked, add its name=value by means of a type=hidden
 * input field
 */
function add_submit_field(button) {
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


/**
 * remove a possible helper input, that was added by `add_submit_field`
 */
function remove_submit_field(button) {
  if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
    const wrapper = get_wrapper(button.form) || {};
    const submit_helper = wrapper.submit_helper;
    if (submit_helper && submit_helper.parentNode) {
      submit_helper.parentNode.removeChild(submit_helper);
    }
  }
}


/**
 * check a form's validity and submit it
 *
 * The method triggers a cancellable `validate` event on the form. If the
 * event is cancelled, form submission will be aborted, too.
 *
 * If the form is found to contain invalid fields, focus the first field.
 */
function check(button) {
  /* trigger a "validate" event on the form to be submitted */
  const val_event = trigger_event(button.form, 'validate',
                                  { cancelable: true });
  if (val_event.defaultPrevented) {
    /* skip the whole submit thing, if the validation is canceled. A user
     * can still call form.submit() afterwards. */
    return;
  }

  var valid = true;
  var first_invalid;
  button.form.__hf_form_validation = true;
  get_validated_elements(button.form).map(element => {
    if (! reportValidity(element)) {
      valid = false;
      if (! first_invalid && ('focus' in element)) {
        first_invalid = element;
      }
    }
  });
  delete(button.form.__hf_form_validation);

  if (valid) {
    submit_form_via(button);
  } else if (first_invalid) {
    /* focus the first invalid element, if validation went south */
    first_invalid.focus();
    /* tell the tale, if anyone wants to react to it */
    trigger_event(button.form, 'forminvalid');
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
function is_submitting_click(event, button) {
  return (
    /* prevented default: won't trigger a submit */
    ! event.defaultPrevented &&

    /* left button or middle button (submits in Chrome) */
    (! ('button' in event) ||
     event.button < 2) &&

    /* must be a submit button... */
    is_submit_button(button) &&

    /* the button needs a form, that's going to be submitted */
    button.form &&

    /* again, if the form should not be validated, we're out of the game */
    ! button.form.hasAttribute('novalidate')
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
        /* ...and <Enter> was pressed... */
        event.keyCode === 13 &&

        /* ...on an <input> that is... */
        event.target.nodeName === 'INPUT' &&

        /* ...a standard text input field (not checkbox, ...) */
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
 * catch clicks to children of <button>s
 */
function get_clicked_button(element) {
  if (is_submit_button(element)) {
    return element;
  } else if (matches(element, 'button:not([type]) *, button[type="submit"] *')) {
    return get_clicked_button(element.parentNode);
  } else {
    return null;
  }
}


/**
 * return event handler to catch explicit submission by click on a button
 */
function get_click_handler(ignore=false) {
  return function(event) {
    const button = get_clicked_button(event.target);
    if (button && is_submitting_click(event, button)) {
      event.preventDefault();
      if (ignore || button.hasAttribute('formnovalidate')) {
        /* if validation should be ignored, we're not interested in any checks */
        submit_form_via(button);
      } else {
        check(button);
      }
    }
  };
}
const click_handler = get_click_handler();
const ignored_click_handler = get_click_handler(true);


/**
 * catch implicit submission by pressing <Enter> in some situations
 */
function get_keypress_handler(ignore) {
  return function keypress_handler(event) {
    if (is_submitting_keypress(event))  {
      event.preventDefault();

      const wrapper = get_wrapper(event.target.form) || { settings: {} };
      if (wrapper.settings.preventImplicitSubmit) {
        /* user doesn't want an implicit submit. Cancel here. */
        return;
      }

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

      /* trigger an "implicit_submit" event on the form to be submitted */
      const implicit_event = trigger_event(event.target.form, 'implicit_submit',
        {
          cancelable: true
        }, {
          trigger: event.target,
          submittedVia: submit || event.target,
        });
      if (implicit_event.defaultPrevented) {
        /* skip the submit, if implicit submit is canceled */
        return;
      }

      if (submit) {
        submit.click();
      } else if (ignore) {
        submit_form_via(event.target);
      } else {
        check(event.target);
      }
    }
  };
}
const keypress_handler = get_keypress_handler();
const ignored_keypress_handler = get_keypress_handler(true);


/**
 * catch all relevant events _prior_ to a form being submitted
 *
 * @param bool ignore bypass validation, when an attempt to submit the
 *                    form is detected. True, when the wrapper's revalidate
 *                    setting is 'never'.
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
