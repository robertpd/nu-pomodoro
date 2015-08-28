var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require("../make-webpack-config")({
  devServer: true,
  hotComponents: true,
  devtool: "eval",
  debug: true
});


//var config = {
//  devtool: 'eval',
//  colors: true,
//  progress: true,
//  entry: [
//    'webpack-dev-server/client?http://localhost:2992',
//    'webpack/hot/only-dev-server',
//    './src/index'
//  ],
//  output: {
//    path: path.join(__dirname, 'dist'),
//    filename: 'bundle.js',
//    publicPath: '/static/'
//  },
//  plugins: [
//    new webpack.HotModuleReplacementPlugin(),
//    new webpack.NoErrorsPlugin()
//  ],
//  module: {
//    loaders: [{
//      test: /\.js$/,
//      loaders: ['react-hot', 'babel'],
//      include: path.join(__dirname, 'src')
//    }]
//  }
//};

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  colors: true,
  progress: true,
  hot: true,
  historyApiFallback: true
}).listen(2992, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:2992');
});