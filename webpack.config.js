var libraryName = 'quickcommerce-react';
var outputFile = libraryName + '.js';


var webpack = require('webpack');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var config = require('./build.config.js');

// Project vars
var PHONEGAP_DIR = __dirname + '/' + config.phonegapDirectory
var PHONEGAP_DEV_PORT = config.phonegapServePort

var SOURCE_DIR = __dirname + '/' + config.sourceDirectory;
var BUILD_DIR = __dirname + '/' + config.buildDirectory;
var TEST_DIR = __dirname + '/' + config.testDirectory;
var LIB_DIR = __dirname + '/' + config.libDirectory;
var THEME_SOURCE_DIR = __dirname + '/' + config.themeSourceDirectory;
var THEME_BUILD_DIR = __dirname + '/' + config.themeBuildDirectory;

// TODO: If settings configured here, override built-in app mechanism
// TODO: Auto-stringify values
var env = {
  QC_SETTING_STORAGE_DRIVER: JSON.stringify('normal'), // Options: [file|uri|text]
  QC_SETTING_ADAPTER: JSON.stringify('custom'), // Options: [qc|custom|...]
  API_VERSION: JSON.stringify('normal'),
  API_TARGET: JSON.stringify('normal'),
  AUTH_MODE: JSON.stringify('normal'), // [normal|legacy|mock]
  // TODO: Endpoint override should be optional
}

var apiBase = {
  INDIGO_BASE_URI: 'http://localhost:9002/',
  QC_APP_URL: 'http://indigo-retailer/',
  QC_BASE_URI: 'http://localhost:9002/',
  QC_LEGACY_API: 'http://localhost:9002/',
  QC_RESOURCE_API: 'http://localhost:9002/',
  QC_API: 'http://localhost:9002/',
  KC_API: 'http://idx-keycloak:9002/',
  QC_IMAGES_PATH: 'image/', // Relative path to catalog image folder
  QC_IMAGES_URI: 'http://indigo-retailer/image/',
  QC_FILES_PATH: 'assets/files/', // Relative path to app file storage folder
  QC_FILES_URI: 'http://indigo-retailer/assets/files/',
  APP_IMAGES_PATH: 'assets/application/images/', // Relative path
  APP_IMAGES_URI: 'http://indigo-retailer/assets/application/images/', // Relative path
  APP_IMAGES: 'assets/application/images/' // TODO: Deprecate this in favor of APP_IMAGES_PATH
}

var key = null

// Map API endpoints
for (key in apiBase) {
  env[key] = JSON.stringify(apiBase[key])
}

module.exports = [{
  // For POS
  entry: SOURCE_DIR + '/js/index.js',
  output: {
    path: BUILD_DIR + '/js',
    //path: PHONEGAP_DIR + '/www/js',
    filename: '[name]-bundle.js',
    publicPath: '/',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            'react',
            'es2015',
            'stage-0',
            'flow'
          ],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(env)
  ],
  externals: {
    jquery: 'jQuery'
  },
  resolve: {
    //root: path.resolve(__dirname),
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      //'quickcommerce-react': LIB_DIR + '/quickcommerce-react/src/js',
      'masonry': 'masonry-layout',
      'isotope': 'isotope-layout',
      //'griddle': LIB_DIR + '/griddle' // Temporary patch to keep using Griddle 0.x with React 16 (React.createClass removed) - we're relying on a fork in the meantime
    }
  }
}]
