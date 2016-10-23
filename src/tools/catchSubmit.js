'use strict';


import triggerEvent from './triggerEvent';
import reportValidity from '../polyfills/reportValidity';
import { text as textTypes } from '../components/types';
import { getWrapper } from '../components/wrapper';


/**
 * submit a form, because `element` triggered it
 *
 * This method also dispatches a submit event on the form prior to the
 * submission. The event contains the trigger element as `submittedVia`.
 *
 * If the element is a button with a name, the name=value pair will be added
 * to the submitted data.
 */
function submitFormVia(element) {
  /* apparently, the submit event is not triggered in most browsers on
   * the submit() method, so we do it manually here to model a natural
   * submit as closely as possible.
   * Now to the fun fact: If you trigger a submit event from a form, what
   * do you think should happen?
   * 1) the form will be automagically submitted by the browser, or
   * 2) nothing.
   * And as you already suspected, the correct answer is: both! Firefox
   * opts for 1), Chrome for 2). Yay! */

  var eventGotCancelled;

  const doCancel = e => {
    eventGotCancelled = e.defaultPrevented;
    /* we prevent the default ourselves in this (hopefully) last event
     * handler to keep Firefox from prematurely submitting the form. */
    e.preventDefault();
  };

  element.form.addEventListener('submit', doCancel);
  triggerEvent(element.form, 'submit', { cancelable: true },
                { submittedVia: element });
  element.form.removeEventListener('submit', doCancel);

  if (! eventGotCancelled) {
    addSubmitField(element);
    window.HTMLFormElement.prototype.submit.call(element.form);
    window.setTimeout(() => removeSubmitField(element));
  }
}


/**
 * if a submit button was clicked, add its name=value by means of a type=hidden
 * input field
 */
function addSubmitField(button) {
  if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
    const wrapper = getWrapper(button.form) || {};
    var submitHelper = wrapper.submitHelper;
    if (submitHelper) {
      if (submitHelper.parentNode) {
        submitHelper.parentNode.removeChild(submitHelper);
      }
    } else {
      submitHelper = document.createElement('input');
      submitHelper.type = 'hidden';
      wrapper.submitHelper = submitHelper;
    }
    submitHelper.name = button.name;
    submitHelper.value = button.value;
    button.form.appendChild(submitHelper);
  }
}


/**
 * remove a possible helper input, that was added by `addSubmitField`
 */
function removeSubmitField(button) {
  if (['image', 'submit'].indexOf(button.type) > -1 && button.name) {
    const wrapper = getWrapper(button.form) || {};
    const submitHelper = wrapper.submitHelper;
    if (submitHelper && submitHelper.parentNode) {
      submitHelper.parentNode.removeChild(submitHelper);
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
function check(event) {
  /* trigger a "validate" event on the form to be submitted */
  const valEvent = triggerEvent(event.target.form, 'validate',
                                  { cancelable: true });
  if (valEvent.defaultPrevented) {
    /* skip the whole submit thing, if the validation is canceled. A user
     * can still call form.submit() afterwards. */
    return;
  }

  var valid = true;
  var firstInvalid;
  Array.prototype.map.call(event.target.form.elements, element => {
    if (! reportValidity(element)) {
      valid = false;
      if (! firstInvalid && ('focus' in element)) {
        firstInvalid = element;
      }
    }
  });

  if (valid) {
    submitFormVia(event.target);
  } else if (firstInvalid) {
    /* focus the first invalid element, if validation went south */
    firstInvalid.focus();
  }
}


/**
 * test if node is a submit button
 */
function isSubmitButton(node) {
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
function isSubmittingClick(event) {
  return (
    /* prevented default: won't trigger a submit */
    ! event.defaultPrevented &&

    /* left button or middle button (submits in Chrome) */
    (! ('button' in event) ||
     event.button < 2) &&

    /* must be a submit button... */
    isSubmitButton(event.target) &&

    /* the button needs a form, that's going to be submitted */
    event.target.form &&

    /* again, if the form should not be validated, we're out of the game */
    ! event.target.form.hasAttribute('novalidate')
  );
}


/**
 * test, if the keypress event would trigger a submit
 */
function isSubmittingKeypress(event) {
  return (
    /* prevented default: won't trigger a submit */
    ! event.defaultPrevented &&

    (
      (
        /* ...and <Enter> was pressed... */
        event.keyCode === 13 &&

        /* ...on an <input> that is... */
        (event.target.nodeName === 'INPUT') &&

        /* ...a standard text input field (not checkbox, ...) */
        textTypes.indexOf(event.target.type) > -1
      ) || (
        /* or <Enter> or <Space> was pressed... */
        (event.keyCode === 13 ||
         event.keyCode === 32) &&

        /* ...on a submit button */
        isSubmitButton(event.target)
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
function clickHandler(event) {
  if (isSubmittingClick(event)) {
    event.preventDefault();
    if (isSubmitButton(event.target) &&
        event.target.hasAttribute('formnovalidate')) {
      /* if validation should be ignored, we're not interested in any checks */
      submitFormVia(event.target);
    } else {
      check(event);
    }
  }
}


/**
 * catch explicit submission by click on a button, but circumvent validation
 */
function ignoredClickHandler(event) {
  if (isSubmittingClick(event)) {
    event.preventDefault();
    submitFormVia(event.target);
  }
}


/**
 * catch implicit submission by pressing <Enter> in some situations
 */
function keypressHandler(event) {
  if (isSubmittingKeypress(event))  {
    const wrapper = getWrapper(event.target.form) || { settings: {} };
    if (wrapper.settings.preventImplicitSubmit) {
      /* user doesn't want an implicit submit. Cancel here. */
      event.preventDefault();
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

    event.preventDefault();
    if (submit) {
      submit.click();
    } else {
      check(event);
    }
  }
}


/**
 * catch implicit submission by pressing <Enter> in some situations, but circumvent validation
 */
function ignoredKeypressHandler(event) {
  if (isSubmittingKeypress(event))  {
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

    event.preventDefault();
    if (submit) {
      submit.click();
    } else {
      submitFormVia(event.target);
    }
  }
}


/**
 * catch all relevant events _prior_ to a form being submitted
 *
 * @param bool ignore bypass validation, when an attempt to submit the
 *                    form is detected.
 */
export function catchSubmit(listeningNode, ignore=false) {
  if (ignore) {
    listeningNode.addEventListener('click', ignoredClickHandler);
    listeningNode.addEventListener('keypress', ignoredKeypressHandler);
  } else {
    listeningNode.addEventListener('click', clickHandler);
    listeningNode.addEventListener('keypress', keypressHandler);
  }
}


/**
 * decommission the event listeners from catchSubmit() again
 */
export function uncatchSubmit(listeningNode) {
  listeningNode.removeEventListener('click', ignoredClickHandler);
  listeningNode.removeEventListener('keypress', ignoredKeypressHandler);
  listeningNode.removeEventListener('click', clickHandler);
  listeningNode.removeEventListener('keypress', keypressHandler);
}
