'use strict';


import comma_split from '../tools/comma_split';
import get_type from '../tools/get_type';
import trim from '../tools/trim';
import { type_checked } from '../components/types';


/* we use a dummy <a> where we set the href to test URL validity
 * The definition is out of the "global" scope so that JSDOM can be instantiated
 * after loading Hyperform for tests.
 */
var url_canary;

/* see https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address */
const email_pattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * test the type-inherent syntax
 */
export default function(element) {
  const type = get_type(element);

  if ((type !== 'file' && ! element.value) ||
      (type !== 'file' && type_checked.indexOf(type) === -1)) {
    /* we're not responsible for this element */
    return true;
  }

  var is_valid = true;

  switch (type) {
    case 'url':
        if (! url_canary) {
          url_canary = document.createElement('a');
        }
        const value = trim(element.value);
        url_canary.href = value;
        is_valid = (url_canary.href === value ||
                    url_canary.href === value+'/');
        break;
    case 'email':
        if (element.hasAttribute('multiple')) {
          is_valid = comma_split(element.value)
                       .every(value => email_pattern.test(value));
        } else {
          is_valid = email_pattern.test(trim(element.value));
        }
        break;
    case 'file':
        if ('files' in element && element.files.length &&
            element.hasAttribute('accept')) {
          const patterns = comma_split(element.getAttribute('accept'))
            .map(pattern => {
              if (/^(audio|video|image)\/\*$/.test(pattern)) {
                pattern = new RegExp('^'+RegExp.$1+'/.+$');
              }
              return pattern;
            });

          if (! patterns.length) {
            break;
          }

          fileloop:
          for (let i = 0; i < element.files.length; i++) {
            /* we need to match a whitelist, so pre-set with false */
            let file_valid = false;

            patternloop:
            for (let j = 0; j < patterns.length; j++) {
              const file = element.files[i];
              const pattern = patterns[j];

              let fileprop = file.type;

              if (typeof pattern === 'string' && pattern.substr(0, 1) === '.') {
                if (file.name.search('.') === -1) {
                  /* no match with any file ending */
                  continue patternloop;
                }

                fileprop = file.name.substr(file.name.lastIndexOf('.'));
              }

              if (fileprop.search(pattern) === 0) {
                /* we found one match and can quit looking */
                file_valid = true;
                break patternloop;
              }

            }

            if (! file_valid) {
              is_valid = false;
              break fileloop;
            }
          }
        }
  }

  return is_valid;
}
