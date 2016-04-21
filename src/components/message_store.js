'use strict';


/**
 * TODO make this a wrapper around a WeakMap and check the element's native
 * validationMessage, too, if that slips through somewhere (e.g. native browser
 * validation). */
const message_store = new WeakMap();


export default message_store;
