(function(){

  if (window.__nflow_devtools_hook__) return;
  if (window.nflow) {
    post('message', 
      'nflow is already initialised. Please reload the page to capture the flow tree');
  }
  else {
    
  }

  function post(type, data){
    var d = window.__nflow_devtools_hook__.serialise(data)
    window.postMessage({
      type: type,
      data: d,
      source: 'nflow-devtools-extension'
    }, '*');
  }

  window.__nflow_devtools_hook__ = function(log){
    post('nflow-log', log)
  }

}())