// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
import d3 from 'd3'
import messaging from './messaging'
import {tree} from 'nflow-vis'

import 'nflow-vis/dist/nflow-vis.css'
import './panel.css'


var dom = d3.select('#tree')

var t = tree()
  .dom(dom.node())

messaging
  .handler(render)

function render(d){
  var p = d.payload
  t.render(d.action, p.flow, p.d, p.d0)
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