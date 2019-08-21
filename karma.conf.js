var customLaunchers = {};

[
  //['chrome', 'dev', 'Windows 10'],
  ['chrome', 'beta', 'Windows 10'],
  ['chrome', '76.0', 'Windows 10'],
  ['chrome', '75.0', 'Windows 10'],
  ['chrome', '74.0', 'Windows 10'],
  ['chrome', '48.0', 'Linux'],
  ['chrome', '69.0', 'macOS 10.14'],
  ['firefox', 'dev', 'Windows 10'],
  ['firefox', 'beta', 'Windows 10'],
  ['firefox', '68', 'Windows 10'], /* ESR */
  ['firefox', '67', 'Windows 10'],
  ['firefox', '66', 'Windows 10'],
  ['firefox', '45.0', 'Linux'],
  ['firefox', '68', 'macOS 10.14'],
  ['MicrosoftEdge', '18', 'Windows 10'],
  ['MicrosoftEdge', '17', 'Windows 10'],
  ['internet explorer', '11.0', 'Windows 10'],
  ['internet explorer', '11.0', 'Windows 8.1'],
  ['internet explorer', '10.0', 'Windows 7'],
  ['internet explorer', '9.0', 'Windows 7'],
  ['safari', '12.0', 'macOS 10.14'],
  ['safari', '11.0', 'OS X 10.13'],
  // TODO: ['iphone', '8.1', 'OS X 10.10'],
  // TODO: ['iphone', '10.0', 'Mac 10.11'],
  // TODO: ['android', '4.4', 'Linux'],
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
      // for IE 9 support
      'test/functional/classList.min.js',
      'dist/hyperform.js',
      'test/functional/test.*.js',
      { pattern: 'test/functional/blank.html', watched: false, included: true, served: true, nocache: true, }
    ],

    proxies: {
      // blank.html loading files from another base dir
      '/blank.html': '/base/test/functional/blank.html',
      '/weakmap.min.js': '/base/test/functional/weakmap.min.js',
      '/classList.min.js': '/base/test/functional/classList.min.js',
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

    browserDisconnectTimeout: 5000,

    sauceLabs: {
      testName: 'Hyperform functional tests',
      recordScreenshots: true,
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
  })
}
