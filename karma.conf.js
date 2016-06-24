var path = require('path')
var webpackConfig = require('./webpack.config.js')

// instrument coverage
webpackConfig.module.preLoaders = [{
  test: /\.js$/,
  loader: 'isparta',
  include: path.join(__dirname, 'src/app'),
  exclude: [/(node_modules)/, /(\.spec\.js)/]
}]

// remove uglify JS
webpackConfig.plugins = []

module.exports = function (config) {
  config.set({
    autoWatch: true,
    browsers: ['Chrome'],
    colors: true,
    coverageReporter: {
      dir: 'coverage',
      instrumenterOptions: {
        istanbul: {
          noCompact: true
        }
      },
      check: {
        global: {
          statements: 85,
          branches: 85,
          functions: 85,
          lines: 85
        }
      },
      watermarks: {
        statements: [85, 99],
        functions: [85, 99],
        branches: [85, 99],
        lines: [85, 99]
      },
      reporters: [{
        type: 'html',
        subdir: 'report-html'
      }, {
        type: 'lcov',
        subdir: 'report-lcov'
      }]
    },
    exclude: [],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/jasmine-expect-jsx/dist/jasmine-expect-jsx.js',
      'src/app/**/*.spec.js'
    ],
    frameworks: [
      'jasmine',
      'jasmine-matchers'
    ],
    junitReporter: {
      outputDir: 'coverage'
    },
    port: 9876,
    preprocessors: {
      'src/app/**/*.spec.js': ['webpack']
    },
    proxies: {
      '/': '/base/src/'
    },
    reporters: [
      'coverage',
      'junit',
      'nested'
    ],
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
