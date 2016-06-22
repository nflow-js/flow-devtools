var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
  entry: {
      'background': './src/background.js'
    , 'devtools': ['./src/devtools.js', './src/devtools.html']
    , 'content-script': './src/site/content-script.js'    
    , 'panel': ['./src/panel/panel.js','./src/panel/panel.html']
    , 'manifest':'./src/manifest.json'
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].js',
    //libraryTarget: 'this'
  },
  resolveLoader: {                                                                                
    root: path.join(__dirname, 'node_modules')                                                  
  },  
  // resolve:{
  //   alias:{
  //     'nflow':'nflow/src'
  //   }
  // },
 
  module: {
    noparse: [ /nflow$/, /nflow-vis/ ],
    loaders: [
      { test: /\.js$/
        , exclude: [/node_modules/, /nflow$/, /nflow-vis/]
        , loader: 'babel'
        , query: { presets: ['es2015', 'stage-0'] }
      },
      { test: /\.(css|scss)$/, loader: ExtractTextPlugin.extract("style-loader", ["css-loader", "sass-loader"]) },
      { test: /\.(html|json|png)/, loader: 'file?name=[name].[ext]' },
      { test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [
    new ExtractTextPlugin("panel.css"),
  ]
};