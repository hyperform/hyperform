'use strict';


export default function(element, event, {
                          bubbles=true,
                          cancelable=false,
                        }={}) {
  if (! (event instanceof window.Event)) {
      let _event = document.createEvent('Event');
      _event.initEvent(event, bubbles, cancelable);
      event = _event;
  }
  element.dispatchEvent(event);

  return event;
}
