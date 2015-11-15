
var myExtension = {
  myListener: function(evt) {
    //console.log("Received from web page: " , evt, evt.detail);
    chrome.extension.sendMessage(evt.detail, function(message){});
  }
}
document.addEventListener("FlowEvent", function(e) { myExtension.myListener(e); }, false);

//console.log("Flow Listener added")
//