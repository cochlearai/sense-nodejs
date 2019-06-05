const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
      SenseClient: './src/SenseClient.ts'
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
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: { configFile: "tslint.json"}
          }
        ]
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
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