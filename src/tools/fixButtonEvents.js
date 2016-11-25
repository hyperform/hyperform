'use strict';


let active = false;


/**
 * this small CSS snippet fixes a problem in Chrome, where a click on
 * a button's child node has this child as event.target. This confuses
 * our "is this a submitting click" check.
 *
 * Why not just check the parent node? Because we check _every_ click,
 * and _every_ keypress possibly on on the whole page, to determine, if
 * this one might be a form submitting event. And checking all parent nodes
 * on every user interaction seems a bit... excessive.
 */
export default function() {
  if (! active) {
    const style = document.createElement("style");

    style.className = 'hf-styles';
    /* WebKit :(. See https://davidwalsh.name/add-rules-stylesheets */
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);

    style.sheet.insertRule(`button:not([type]) *,button[type="submit"] *,button[type="image"] *{pointer-events:none}`);

    active = true;
  }
}
