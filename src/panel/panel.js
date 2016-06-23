// This one acts in the context of the panel in the Dev Tools
//
// Can use
// chrome.devtools.*
// chrome.extension.*
import d3 from 'd3'
import 'nflow-vis/dist/nflow-vis.css'
import 'font-awesome/scss/font-awesome.scss';
import './panel.scss'
import Comms from './comms.js'

import tpl from 'raw!./content.tpl'
import 'file?name=[name].[ext]!nflow/dist/nflow.js?'
import 'file?name=[name].[ext]!nflow-vis/dist/nflow-vis.js?'

var comms = Comms()
var vis, tree, timeline

var queue = []
var maxQueueLength = 1

comms
  .onMessage(parseMessage)

function parseMessage(type, data){
  //console.log('got message from background page', type, data)
  switch (type){
    case 'messages':
      console.log('got some catchup messages:', data.length)
      data.forEach(d=>parseMessage(d.type, d.data))
      
      break;
    case 'init':
      console.log('init from content-page')
      reset()
      break;
    case 'nflow-log':
      queue.push(data)
      log('')
      maxQueueLength = Math.max(maxQueueLength, queue.length)
      updateQueue()
      break;
    case 'disconnected':
      log('The nflow Devtools panel has been disconnected from the inspected page. Please <a>refresh</a> the page to reconnect.', true)
        .select('a')
        .on('click', ()=>{
          d3.event.preventDefault()
          comms.eval('location.reload()')
      })
      break;
   
  }
}

function log(d, isError){
  return d3.select('footer>.message')
    .html(d)
    .classed('is-error', isError)
}

function updateQueue(){
  if (updateQueue.timer) return;
  var d3progress = d3.select('footer>progress')

  updateQueue.timer = setInterval(()=>{
    
    if (!queue.length) {
      maxQueueLength = 0
      updateQueue.clear()
      var s = vis.emit('get-model').data()
      vis.emit('update', s)
      return;
    }
    d3progress
      .classed('is-hidden', queue.length<10)
      .attr('max', maxQueueLength)
      .attr('value', maxQueueLength-queue.length)

    let d = queue.shift()
    vis.emit('action', d.action, d.flow, d.d,d.d0)
  }, 1)
}

updateQueue.clear = function(){
  updateQueue.timer 
    && clearInterval(updateQueue.timer)
  delete updateQueue.timer  
}


function reset(){
  queue = []
  updateQueue.clear()
  var d3vis = d3.select('body').html('').node()
  vis && vis.dispose()
  vis = nflowVis.Debug()
  d3.select(window)
    .on('resize.tree', ()=>vis.emit('resize'))
  vis
    .emit.downstream('dom', d3vis)
    .emit('resize')

  log('Waiting for nflow messages...', true)
}

reset()