var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  entry: {
      'background': './src/background.js'
    , 'devtools': ['./src/devtools.js', './src/devtools.html']
    , 'inserted-script': './src/inserted-script.js'
    , 'messageback-script':'./src/messageback-script.js'
    
    , 'panel': ['./src/panel.js','./src/panel.html']
    , 'manifest':'./src/manifest.json'
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    //libraryTarget: 'this'
  },
  module: {
    noparse: [ /nflow-vis/ ],
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/ , /nflow-vis/],
        loader: 'babel?presets[]=es2015'
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") }  ,
      { test: /\.(html|json|png)/, loader: 'file?name=[name].[ext]' }
    ]
  },
  plugins: [
    new ExtractTextPlugin("panel.css"),
  ]
};