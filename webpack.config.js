const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
      CochlearSense: './src/CochlearSense.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'commonjs',
  },
  target: 'node',
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules|\.test\.ts/
      }
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  externals:[
      nodeExternals()
  ]
};