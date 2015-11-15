var path = require('path');

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
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel?presets[]=es2015'
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
        include: APP_PATH
      },
      { test: /\.(html|json|png)/, loader: 'file?name=[name].[ext]' }
    ]
  },
  plugins: [
    
  ]
};