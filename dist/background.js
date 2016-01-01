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

	// Chrome automatically creates a background.html page for this to execute.
	// This can access the inspected page via executeScript
	//
	// Can use:
	// chrome.tabs.*
	// chrome.extension.*

	chrome.extension.onConnect.addListener(function (port) {

	    var extensionListener = function extensionListener(message, sender, sendResponse) {

	        if (message.tabId && message.content) {

	            //Evaluate script in inspectedPage
	            if (message.action === 'code') {
	                chrome.tabs.executeScript(message.tabId, { code: message.content });

	                //Attach script to inspectedPage
	            } else if (message.action === 'script') {
	                    chrome.tabs.executeScript(message.tabId, { file: message.content });

	                    //Pass message to inspectedPage
	                } else {
	                        chrome.tabs.sendMessage(message.tabId, message, sendResponse);
	                    }

	            // This accepts messages from the inspectedPage and
	            // sends them to the panel
	        } else {
	                port.postMessage(message);
	            }
	        sendResponse(message);
	    };

	    // Listens to messages sent from the panel
	    chrome.extension.onMessage.addListener(extensionListener);

	    port.onDisconnect.addListener(function (port) {
	        chrome.extension.onMessage.removeListener(extensionListener);
	    });

	    // port.onMessage.addListener(function (message) {
	    //     port.postMessage(message);
	    // });
	});
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	    return true;
	});

/***/ }
/******/ ]);