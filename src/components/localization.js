'use strict';


const catalog = {};


export function add_translations(new_catalog) {
  for (let key in new_catalog.keys()) {
    catalog[key] = new_catalog[key];
  }
}


export default function(s) {
  if (s in catalog) {
    return catalog[s];
  }
  return s;
}
