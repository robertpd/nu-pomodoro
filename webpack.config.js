module.exports = {
  entry: './client/index.js',
  output: {
    filename: 'bundle.js',
    path: './public'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  }
};