// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
import messaging from './messaging'
import Tree from './components/tree'

var tree = Tree()
  .dom(document.querySelector('#tree'))

resize()

messaging
  .handler(tree.render)

d3.select(window)
  .on('resize', resize)

function resize(){
  tree.width(document.body.clientWidth)
  tree.height(document.body.clientHeight)
  tree.update()
}

// document.querySelector('#executescript').addEventListener('click', function() {
//     messaging.send({action: "code", content: "console.log('Inline script executed')"});
// }, false);

// document.querySelector('#insertscript').addEventListener('click', function() {
//     messaging.send({action: "script", content: "inserted-script.js"});
// }, false);

// document.querySelector('#insertmessagebutton').addEventListener('click', function() {
//     messaging.send({action: "code", content: "document.body.innerHTML='<button>Send message to DevTools</button>'"});
//     messaging.send({action: "script", content: "messageback-script.js"});
// }, false);