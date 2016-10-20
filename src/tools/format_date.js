'use strict';


export default function(date, part=undefined) {
  switch (part) {
    case 'date':
      return (date.toLocaleDateString || date.toDateString).call(date);
    case 'time':
      return (date.toLocaleTimeString || date.toTimeString).call(date);
    case 'month':
      return ('toLocaleDateString' in date)?
        date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: '2-digit',
        })
        :
        date.toDateString();
    // case 'week':
    // TODO
    default:
      return (date.toLocaleString || date.toString).call(date);
  }
}
