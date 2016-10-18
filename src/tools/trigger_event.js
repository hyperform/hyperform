'use strict';

/* the following code is borrowed from the WebComponents project, licensed
 * under the BSD license. Source:
 * <https://github.com/webcomponents/webcomponentsjs/blob/5283db1459fa2323e5bfc8b9b5cc1753ed85e3d0/src/WebComponents/dom.js#L53-L78>
 */
// defaultPrevented is broken in IE.
// https://connect.microsoft.com/IE/feedback/details/790389/event-defaultprevented-returns-false-after-preventdefault-was-called
const workingDefaultPrevented = (function() {
  const e = document.createEvent('Event');
  e.initEvent('foo', true, true);
  e.preventDefault();
  return e.defaultPrevented;
})();

if (!workingDefaultPrevented) {
  const origPreventDefault = window.Event.prototype.preventDefault;
  window.Event.prototype.preventDefault = function() {
    if (!this.cancelable) {
      return;
    }

    origPreventDefault.call(this);

    Object.defineProperty(this, 'defaultPrevented', {
      get: function() {
        return true;
      },
      configurable: true
    });
  };
}
/* end of borrowed code */


export default function(element, event, {
                          bubbles=true,
                          cancelable=false,
                        }={}, payload={}) {
  if (! (event instanceof window.Event)) {
      const _event = document.createEvent('Event');
      _event.initEvent(event, bubbles, cancelable);
      event = _event;
  }

  for (let key in payload) {
    if (payload.hasOwnProperty(key)) {
      event[key] = payload[key];
    }
  }

  element.dispatchEvent(event);

  return event;
}
