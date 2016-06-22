// background.js
var connections = {};
const DISCONNECTED = {}
console.log('nflow-devtools background page is running.')
chrome.runtime.onConnect.addListener(function (port) {

    var extensionListener = function (message, sender, sendResponse) {

        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        console.log('message from devtools',message)
        if (message.name == "init") {
          console.log('nflow devtools tab initialised.')
          connections[message.tabId] = port;
          
          // flush pending messages
          if (messageCache[message.tabId]) {

            if (messageCache[message.tabId] == DISCONNECTED){
              connections[message.tabId].postMessage({
                type: 'disconnected'
              });
              return;
            }

            connections[message.tabId].postMessage({
              type: 'messages',
              data: messageCache[message.tabId]
            });
            disconnect(message.tabId)
          }
          
          return;
        }

    // other message handling
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
        port.onMessage.removeListener(extensionListener);

        var tabs = Object.keys(connections);
        for (var i=0, len=tabs.length; i < len; i++) {
          if (connections[tabs[i]] == port) {
            delete connections[tabs[i]]
            disconnect(tabs[i])
            break;
          }
        }
    });
});

function disconnect(tab){
  if (messageCache[tab] && messageCache[tab].length)
    messageCache[tab] = DISCONNECTED
}
function reconnect(tab){
  messageCache[tab] = []
}

var messageCache = {}
// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('got message from content page', request, sender)
    // Messages from content scripts should have sender.tab set
    if (sender.tab) {
      var tabId = sender.tab.id;
      
      if (tabId in connections) {
        connections[tabId].postMessage(request);
      } else {
        //console.log("Tab not found in connection list, caching messages.");
        console.log('caching', request.type)
        if (request.type=='init'){
          reconnect(tabId)
        }
        else messageCache[tabId].push(request)
      }
    } else {
      console.log("sender.tab not defined.");
    }
    return true;
});