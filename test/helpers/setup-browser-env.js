global.document = require('jsdom').jsdom('<body></body>', {
  url: 'http://example.com',
});
global.window = document.defaultView;
global.navigator = window.navigator;
