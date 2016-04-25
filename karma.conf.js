var webpackConf = require('./webpack.config.js')
module.exports = function (karma) {
    karma.set({
      // base path, that will be used to resolve files and exclude
      basePath: './',
      frameworks: ['mocha'],
      // list of files / patterns to load in the browser
      files: ['test/*.js'],
      webpack: webpackConf,
      reporters: ['mocha','htmlalt'],
      mochaReporter: {
        output: 'autowatch'
      },
      preprocessors: {
        'test/*.js': 'webpack'
      },
      htmlReporter: {
        outputFile: 'unitTestResult/units.html',
        // Optional
        pageTitle: '前端测试',
        subPageTitle: ''
      },
      coverageReporter: {
          // cf. http://gotwarlost.github.com/istanbul/public/apidocs/
          type: 'lcov',
          dir: 'coverage/'
      },
      // web server port
      port: 9876,
      // cli runner port
      runnerPort: 9100,
      // enable / disable colors in the output (reporters and logs)
      colors: true,
      // level of logging
      // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
      logLevel: karma.LOG_DEBUG,
      // enable / disable watching file and executing tests whenever any file changes
      autoWatch: true,
      // If browser does not capture in given timeout [ms], kill it
      captureTimeout: 6000,
      // Continuous Integration mode
      // if true, it capture browsers, run tests and exit
      singleRun: false,
      browsers: ['Chrome'],
      plugins: [
          require('karma-mocha'),
          require('karma-chrome-launcher'),
          require('karma-mocha-reporter'),
          require('karma-htmlfilealt-reporter'),
          require('karma-webpack'),
      ]
  });
}
