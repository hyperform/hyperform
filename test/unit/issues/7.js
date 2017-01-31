'use strict';


/* this whole testcase suffers from
 * HTMLFormElement !== window.HTMLFormElement
 * in JSDOM.
 */


import test from 'ava';
import Wrapper from '../../../src/components/wrapper';


test.skip('issue 7 form', t => {
  var form = document.createElement(form);
  var wrapper = new Wrapper(form, {revalidate: 'never'});
  t.true('reportValidity' in form);
});

test.skip('issue 7 window', t => {
  var wrapper = new Wrapper(window, {revalidate: 'never'});
  var form = document.createElement(form);
  t.true('reportValidity' in form);
});
