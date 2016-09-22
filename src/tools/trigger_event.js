'use strict';


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
