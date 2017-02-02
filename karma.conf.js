var customLaunchers = {};

[
  ['chrome', 'dev', 'Windows 10'],
  ['chrome', 'beta', 'Windows 10'],
  ['chrome', '55.0', 'Windows 10'],
  ['chrome', '54.0', 'Windows 10'],
  ['chrome', '53.0', 'Windows 10'],
  ['chrome', '48.0', 'Linux'],
  ['firefox', 'dev', 'Windows 10'],
  ['firefox', 'beta', 'Windows 10'],
  ['firefox', '50.0', 'Windows 10'],
  ['firefox', '49.0', 'Windows 10'],
  ['firefox', '48.0', 'Windows 10'],
  ['firefox', '45.0', 'Windows 10'], /* ESR */
  ['firefox', '45.0', 'Linux'],
  ['MicrosoftEdge', '14.14393', 'Windows 10'],
  ['internet explorer', '11.0', 'Windows 8.1'],
  // TODO: strange error: ['internet explorer', '10.0', 'Windows 7'],
  // TODO: needs classList polyfill: ['internet explorer', '9.0', 'Windows 7'],
  ['safari', '10.0', 'macOS 10.12'],
  // TODO: doesn't work: ['iphone', '7.1', 'OS X 10.9'],
  // TODO: Android
].forEach(set => {
  customLaunchers['sl_'+set.join('_').replace(/[^a-zA-Z0-9_]+/g, '_')] = {
      base: 'SauceLabs',
      browserName: set[0],
      version: set[1],
      platform: set[2],
  };
});

module.exports = function(config) {

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      // for IE 10 support
      'test/functional/weakmap.min.js',
      'dist/hyperform.js',
      'test/functional/test.*.js',
      { pattern: 'test/functional/blank.html', watched: false, included: true, served: true, nocache: true, }
    ],

    proxies: {
      '/blank.html': '/base/test/functional/blank.html',
      '/dist/hyperform.js': '/base/dist/hyperform.js',
    },

    preprocessors: [],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 5,

    sauceLabs: {
      testName: 'Hyperform functional tests',
      recordScreenshots: true,
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
  })
}
