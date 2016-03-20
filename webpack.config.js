var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  },
  node: {
    console: true,
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    alias: {
      webworkify: 'webworkify-webpack'
    }
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },
  module: {
    loaders: [{
      test: /\.vue$/,
      loader: 'vue'
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.html$/,
      loader: 'vue-html'
    }, {
      test: /\.css$/,
      loader: 'vue-style!css'
    }, {
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: '[name].[ext]'
      }
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/mapbox-gl/js/render/shaders.js'),
      loader: 'transform/cacheable?brfs'
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
      loader: 'worker'
    }]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: 'eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = 'source-map'
    // http://vuejs.github.io/vue-loader/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ])
}
