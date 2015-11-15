import './tree.css'
import d3 from "d3"

var actions = {}
export default ()=>{
  
  var instance = {}
    , state = {}

  instance.dom = dom=>(state.dom=dom, instance)
  instance.width = width=>(state.width=width,instance)
  instance.height = height=>(state.height=height, instance)
  
  instance.render = data=>render(data, state)
  instance.update = ()=>update(state)


  return instance

}


function render(d, s){
  //console.log('rendering', d, s.d3dom)
  if (!s.d3dom) init(s);
  actions[d.action](d.payload,s)
  resizeSvg(s)

  s.nodes = s.tree.nodes(s.root).reverse(),
  s.links = s.tree.links(s.nodes);
  
  //Normalize for fixed-depth.
  s.nodes.forEach(function(d) { d.y = d.depth * 40; });

  update(s)
}

function update(s){
  if (!s.d3dom) return;
  renderNodes(s)
  renderLinks(s)
}

function init(s){
  s.nodeMap = {}
  s.tree = d3.layout.tree()
  s.diagonal = d3.svg.diagonal()
  s.d3dom = d3.select(s.dom)
  s.svg = s.d3dom
    .html("")
    .append("svg")
  s.svgg = s.svg.append("g")
  s.margin = {top: 20, right: 100, bottom: 20, left: 20}
  s.delay = 100
  s.duration = 100
  s.nodes = []
  s.links = []
  
  s.svgg
      .attr("transform"
        , "translate(" + s.margin.left + "," + s.margin.top + ")");

  s.diagonal
    .projection(function(d) { return [d.x, d.y]; });
}

actions.start = (d,s)=>{
  console.log('start')
  init(s)
  s.root = {
      name: d.name,
      id: d.id,
      parent: null,
      children: [],
      isNew: true,
      numInstances:1
    }
  s.nodeMap[s.root.id]= s.root
}

actions.create = (d, s)=>{
    var p = s.nodeMap[d.parentId]
    p.children = p.children || [];
    var existingNode = p.children.filter(c=>c.name==d.name).pop()
    
    s.nodeMap[d.id] = {
      name: d.name,
      id: d.id,
      children: [],
      isNew: true,
      numInstances:1
    }

    if (existingNode){
      removeNode(existingNode,s)
      s.nodeMap[d.id].numInstances+=existingNode.numInstances
      s.nodeMap[d.id].isNew= false
    }
    
    p.children.push(s.nodeMap[d.id])
    
    
  }

function removeNode(d,s){
  d.childen && d.children.forEach(n=>removeNode(n,s))
  if (d.parent) d.parent.children = d.parent.children.filter(n=>n.id!=d.id)
  delete s.nodeMap[d.id]
}

function nodeClicked(d){
  console.log('clicked', d)
}

function resizeSvg(s){
  var width = s.width - s.margin.right - s.margin.left
    , height = s.height - s.margin.top - s.margin.bottom;
  s.tree.size([width, height]);
  s.root.x0 = s.root.x = width / 2;
  s.root.y0 = s.root.y = 0;   

  s.svg
    .attr("width", s.width + s.margin.right +s. margin.left)
    .attr("height", s.height + s.margin.top + s.margin.bottom)
  
}

function renderNodes(s){
  // Update the nodes…
  var node = s.svgg.selectAll("g.node")
    .data(s.nodes, function(d) { return d.id })
  
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + ((d.isNew&&d.parent)||d)['x'] + "," + ((d.isNew&&d.parent)||d)['y'] + ")"; })
    .on("click", nodeClicked);

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
    .attr("x", function(d) { return 7; })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .style("fill-opacity", .1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(d=>d.isNew?s.duration:0)
    .delay(d=>d.isNew?s.delay:0)
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
    .attr("r", 4)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
    .text(function(d) { return (d.numInstances>1?d.numInstances+'x ':'')+d.name; })
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit()
    .remove();

  // Stash the old positions for transition.
  s.nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
    delete d.isNew
  });
}

function renderLinks(s){
  // Update the links
  var link = s.svgg.selectAll("path.link")
    .data(s.links, function(d) { return d.target.id; });
  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
    var o = {x: d.source.x, y: d.source.y};
    return s.diagonal({source: o, target: o});
    });

  // Transition links to their new position.
  link.transition()
    .duration(d=>d.target.isNew?s.duration:0)
    .delay(d=>d.target.isNew?s.delay:0)
    .attr("d", s.diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit()
    .remove();
}

