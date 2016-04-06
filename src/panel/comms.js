export default ()=>{
  console.log('initialising nflow Devtols<->background comms')
  //var init = ()=>{}
  var onMessage = ()=>{}
  var api = {}
  
  var backgroundPageConnection = chrome.runtime.connect({
    name: "nflow"
  });

  backgroundPageConnection
    .onMessage.addListener(function(request, sender, sendResponse) {
      //console.log('comms incoming message', request)
      onMessage(request.type, request.data)
    })

  backgroundPageConnection.postMessage({
      name: 'init',
      tabId: chrome.devtools.inspectedWindow.tabId
  });

  function evalMessage(msg, handler){
    chrome.devtools.inspectedWindow.eval(msg,
      function(result, isException) {
        handler && handler(result, isException)
        console.log('eval result:', result, isException)
      }
    )
  }

  //api.onInit = f=>(f(), init=f, api)
  api.onMessage = f=>(onMessage=f,api)
  api.eval = evalMessage
  return api
}