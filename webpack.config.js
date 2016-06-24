var webpack = require('webpack')
var path = require('path')
var dockerIp = require('docker-ip')
var reverseProxyIp = '127.0.0.1'

try {
  reverseProxyIp = dockerIp()
} catch (e) {
  console.log('docker not found or not running. Reverse proxying API requests to localhost')
}

const reverseProxyUpstream = process.env.REMOTE_API_URI || 'http://${reverseProxyIp}:9888/'

console.log('NODE_ENV: %s', process.env.NODE_ENV)

module.exports = {
  entry: './src/app/index.js',
  devtool: 'source-map',
  output: {
    filename: 'app.js',
    path: './dist'
  },
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    inline: true,
    port: 8080,
    stats: 'errors-only',
    proxy: {
      '/api/*': {
        target: reverseProxyUpstream,
        rewrite: function (req) {
          req.url = req.url.replace(/^\/api/, '')
        }
      }
    }
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'react']
      }
    }, {
      test: /\.svg$/,
      loader: 'svg-inline'
    }]
  },
  progress: true,
  resolve: {
    root: [
      path.resolve('./src'),
      path.resolve('./node_modules')
    ],
    extensions: ['', '.json', '.js', '.jsx']
  },
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  plugins: getPlugins()
}

function getPlugins () {
  if (process.env.NODE_ENV === 'development') {
    return [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"development"'
        }
      })
    ]
  }
  return [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    })
  ]
}
