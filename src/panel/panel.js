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
import nflow from 'nflow'
import {nflowVis} from 'nflow-vis/src'
import split from 'split.js'
import tpl from 'raw!./content.tpl'

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
      let d = JSON.parse(data)
      queue.push(d)
      maxQueueLength = Math.max(maxQueueLength, queue.length)
      updateQueue()
      //console.log('visualising', d)
      
      break;
  }
}

function updateQueue(){
  if (updateQueue.timer) return;
  var d3progress = d3.select('footer>progress')

  updateQueue.timer = setInterval(()=>{
    
    if (!queue.length) {
      maxQueueLength = 0
      updateQueue.clear()
      return;
    }
    d3progress
      .classed('is-hidden', queue.length<10)
      .attr('max', maxQueueLength)
      .attr('value', maxQueueLength-queue.length)

    let d = queue.shift()
    
    vis.emit('action', d.name, d.flow, d.d,d.d0)
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
  d3.select('.content').html(tpl)
  split(['.nodes', '.details'], {
      direction: 'horizontal',
      sizes: [75, 25],
      minSize: [10, 10],
      gutterSize: 8,
      cursor: 'column-resize',
      snapOffset: 10,
      onDrag:()=>vis.emit('resize')
    })
  

  split(['.nflow-tree', '.nflow-timeline'], {
      direction: 'vertical',
      sizes: [75, 25],
      minSize: [10, 10],
      snapOffset: 10,
      gutterSize: 8,
      cursor: 'row-resize',
      onDrag:()=>vis.emit('resize')
    })
  var d3timeline = d3.select('.nflow-timeline')
  var d3tree = d3.select('.nflow-tree')
  
  vis && vis.dispose()
  vis = nflowVis.Vis()
  d3.select(window).on('resize.tree', ()=>vis.emit('resize'))


  tree = nflowVis.Tree(vis)
  tree.emit.downstream('dom', d3tree.node())
  tree.emit.downstream('show-events', false)
  
  timeline = nflowVis.Timeline(vis)
  timeline.emit.downstream('dom', d3timeline.node())

}

reset()