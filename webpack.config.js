var webpack = require('webpack');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var config = require('./build.config.js');

// Project vars
var PHONEGAP_DIR = __dirname + '/' + config.phonegapDirectory;
var PHONEGAP_DEV_PORT = config.phonegapServePort;

var APP_DIR = __dirname + '/' + config.sourceDirectory;
var BUILD_DIR = __dirname + '/' + config.buildDirectory;
var LIB_DIR = __dirname + '/' + config.libDirectory;
var THEME_SOURCE_DIR = __dirname + '/' + config.themeSourceDirectory;
var THEME_BUILD_DIR = __dirname + '/' + config.themeBuildDirectory;

module.exports = [{
   // For POS
   entry: {
       //catalog: APP_DIR + '/js/Catalog.jsx',
       //checkout: APP_DIR + '/js/Checkout.jsx',
       //cms: APP_DIR + '/js/CMS.jsx',
       //cart: APP_DIR + '/js/Cart.jsx',
       pos: APP_DIR + '/js/Main.jsx'
   },
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
                         'es2015'
                    ],
                    plugins: [
                        'transform-class-properties'
                    ]
                }
            },
            {
                test: /\.css$/, loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/, loader: 'style-loader!sass-loader!css-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            QC_BASE_URI: JSON.stringify('http://acecoffeeroasters.com/'),
            QC_LEGACY_API: JSON.stringify('http://acecoffeeroasters.com/api/rest/'),
            QC_RESOURCE_API: JSON.stringify('http://acecoffeeroasters.com/qcapi/api/res/'),
            QC_API: JSON.stringify('http://acecoffeeroasters.com/qcapi/api/v1/')
        })
        /*new webpack.DefinePlugin({
            QC_BASE_URI: JSON.stringify('http://acecoffeeroasters/'),
            QC_LEGACY_API: JSON.stringify('http://acecoffeeroasters/api/rest/'),
            QC_RESOURCE_API: JSON.stringify('http://acecoffeeroasters/qcapi/api/res/'),
            QC_API: JSON.stringify('http://acecoffeeroasters/qcapi/api/v1/')
        })*/
        /*new webpack.DefinePlugin({
            QC_BASE_URI: JSON.stringify('http://qcpos/'),
            QC_LEGACY_API: JSON.stringify('http://qcpos/api/rest/'),
            QC_RESOURCE_API: JSON.stringify('http://qcpos/qcapi/api/res/'),
            QC_API: JSON.stringify('http://qcpos/qcapi/api/v1/')
        })*/
    ],
    externals: {
        'react-dom': 'ReactDOM',
        react: 'React',
        jquery: 'jQuery'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    }  
}]