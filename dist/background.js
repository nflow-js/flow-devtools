/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	// background.js
	var connections = {};
	console.log('nflow-devtools background page is running.');
	chrome.runtime.onConnect.addListener(function (port) {

	  var extensionListener = function extensionListener(message, sender, sendResponse) {

	    // The original connection event doesn't include the tab ID of the
	    // DevTools page, so we need to send it explicitly.
	    console.log('message from devtools', message);
	    if (message.name == "init") {
	      console.log('nflow devtools tab initialised.');
	      connections[message.tabId] = port;

	      // flush pending messages
	      if (messageCache[message.tabId]) {
	        connections[message.tabId].postMessage({
	          type: 'messages',
	          data: messageCache[message.tabId]
	        });
	        delete messageCache[message.tabId];
	      }
	      return;
	    }

	    // other message handling
	  };

	  // Listen to messages sent from the DevTools page
	  port.onMessage.addListener(extensionListener);

	  port.onDisconnect.addListener(function (port) {
	    port.onMessage.removeListener(extensionListener);

	    var tabs = Object.keys(connections);
	    for (var i = 0, len = tabs.length; i < len; i++) {
	      if (connections[tabs[i]] == port) {
	        delete connections[tabs[i]];
	        delete messageCache[tabs[i]];
	        break;
	      }
	    }
	  });
	});

	var messageCache = {};
	// Receive message from content script and relay to the devTools page for the
	// current tab
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	  //console.log('got message from content page', request, sender)
	  // Messages from content scripts should have sender.tab set
	  if (sender.tab) {
	    var tabId = sender.tab.id;
	    if (tabId in connections) {
	      connections[tabId].postMessage(request);
	    } else {
	      //console.log("Tab not found in connection list, caching messages.");
	      console.log('caching', request.type);
	      if (!messageCache[tabId]) messageCache[tabId] = [];
	      messageCache[tabId].push(request);
	    }
	  } else {
	    console.log("sender.tab not defined.");
	  }
	  return true;
	});

/***/ }
/******/ ]);