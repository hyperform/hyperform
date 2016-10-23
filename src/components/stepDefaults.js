'use strict';


export const defaultStep = {
  'datetime-local': 60,
  datetime: 60,
  time: 60,
};

export const stepScaleFactor = {
  'datetime-local': 1000,
  datetime: 1000,
  date: 86400000,
  week: 604800000,
  time: 1000,
};

export const defaultStepBase = {
  week: -259200000,
};

export const defaultMin = {
  range: 0,
};

export const defaultMax = {
  range: 100,
};
