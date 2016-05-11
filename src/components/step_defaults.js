'use strict';


export const default_step = {
  'datetime-local': 60,
  datetime: 60,
  time: 60,
};

export const step_scale_factor = {
  'datetime-local': 1000,
  datetime: 1000,
  date: 86400000,
  week: 604800000,
  time: 1000,
};

export const default_step_base = {
  week: -259200000,
};

export const default_min = {
  range: 0,
};

export const default_max = {
  range: 100,
};
