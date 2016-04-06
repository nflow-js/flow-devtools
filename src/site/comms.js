/**
 *  SITE <--> CONTENTSCRIPT communication channel
 */

export default (name)=>{

  var api = {}
  var onMessage = ()=>{}

  api.inject = (js)=>{
    var script = document.createElement('script');
    script.textContent = js;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
    return api
  }
  
  api.onMessage = (handler=>onMessage=handler, api)

  api.send = (type, data)=>{
    chrome.runtime.sendMessage({
      type: type,
      data: data,
      source: name
    });
  }
  window.addEventListener('message', function(event) {
    // Only accept messages from the same frame
    if (event.source !== window) {
      return;
    }
    var message = event.data;
    // Only accept messages that we know are ours
    if (typeof message !== 'object' || message === null ||
        !message.source === name) {
      return;
    }
    onMessage(message)
    chrome.runtime.sendMessage(message);
  });

  return api

}