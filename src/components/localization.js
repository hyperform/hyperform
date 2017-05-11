'use strict';


/**
 * the following validation messages are from Firefox source,
 * http://mxr.mozilla.org/mozilla-central/source/dom/locales/en-US/chrome/dom/dom.properties
 * released under MPL license, http://mozilla.org/MPL/2.0/.
 */
const catalog = {
  en: {
    TextTooLong: 'Please shorten this text to %l characters or less (you are currently using %l characters).',
    ValueMissing: 'Please fill out this field.',
    CheckboxMissing: 'Please check this box if you want to proceed.',
    RadioMissing: 'Please select one of these options.',
    FileMissing: 'Please select a file.',
    SelectMissing: 'Please select an item in the list.',
    InvalidEmail: 'Please enter an email address.',
    InvalidURL: 'Please enter a URL.',
    PatternMismatch: 'Please match the requested format.',
    PatternMismatchWithTitle: 'Please match the requested format: %l.',
    NumberRangeOverflow: 'Please select a value that is no more than %l.',
    DateRangeOverflow: 'Please select a value that is no later than %l.',
    TimeRangeOverflow: 'Please select a value that is no later than %l.',
    NumberRangeUnderflow: 'Please select a value that is no less than %l.',
    DateRangeUnderflow: 'Please select a value that is no earlier than %l.',
    TimeRangeUnderflow: 'Please select a value that is no earlier than %l.',
    StepMismatch: 'Please select a valid value. The two nearest valid values are %l and %l.',
    StepMismatchOneValue: 'Please select a valid value. The nearest valid value is %l.',
    BadInputNumber: 'Please enter a number.',
  },
};


/**
 * the global language Hyperform will use
 */
var language = 'en';


/**
 * the base language according to BCP47, i.e., only the piece before the first hyphen
 */
var base_lang = 'en';


/**
 * set the language for Hyperform’s messages
 */
export function set_language(newlang) {
  language = newlang;
  base_lang = newlang.replace(/[-_].*/, '');
}


/**
 * add a lookup catalog "string: translation" for a language
 */
export function add_translation(lang, new_catalog) {
  if (! (lang in catalog)) {
    catalog[lang] = {};
  }
  for (let key in new_catalog) {
    if (new_catalog.hasOwnProperty(key)) {
      catalog[lang][key] = new_catalog[key];
    }
  }
}


/**
 * return `s` translated into the current language
 *
 * Defaults to the base language and then English if the former has no
 * translation for `s`.
 */
export default function(s) {
  if ((language in catalog) && (s in catalog[language])) {
    return catalog[language][s];
  } else if ((base_lang in catalog) && (s in catalog[base_lang])) {
    return catalog[base_lang][s];
  } else if (s in catalog.en) {
    return catalog.en[s];
  }
  return s;
}
