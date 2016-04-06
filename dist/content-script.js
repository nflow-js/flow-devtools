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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _injectedScript = __webpack_require__(1);

	var _injectedScript2 = _interopRequireDefault(_injectedScript);

	var _serialiser = __webpack_require__(2);

	var _serialiser2 = _interopRequireDefault(_serialiser);

	var _comms = __webpack_require__(3);

	var _comms2 = _interopRequireDefault(_comms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _comms2.default)('nflow-devtools-extension').inject(_injectedScript2.default).inject(_serialiser2.default).send('init');

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "'use strict';\n\n(function () {\n\n  if (window.__nflow_devtools_hook__) return;\n  if (window.nflow) {\n    post('message', 'nflow is already initialised. Please reload the page to capture the flow tree');\n  } else {}\n\n  function post(type, data) {\n    var d = window.__nflow_devtools_hook__.serialise(data);\n    window.postMessage({\n      type: type,\n      data: d,\n      source: 'nflow-devtools-extension'\n    }, '*');\n  }\n\n  window.__nflow_devtools_hook__ = function (log) {\n    post('nflow-log', log);\n  };\n})();"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "\"use strict\";\n\nfunction _typeof(obj) { return obj && typeof Symbol !== \"undefined\" && obj.constructor === Symbol ? \"symbol\" : typeof obj; }\n\n(function () {\n\n  console.log('adding nflow serialiser');\n  if (!window.__nflow_devtools_hook__) return;\n  window.__nflow_devtools_hook__.serialise = function (o) {\n    return JSON.stringify(o, replacer());\n  };\n\n  window.__nflow_devtools_hook__.serialise.filter = function (value) {\n    // i.e. return !(value instanceof Node)\n    // to ignore nodes\n    return value;\n  };\n\n  function replacer(stack, undefined, r, i) {\n\n    return function replacer(key, value) {\n      // this happens only first iteration\n      // key is empty, and value is the object\n      if (key === \"\") {\n        // put the value in the stack\n        stack = [value];\n        // and reset the r\n        r = 0;\n        return value;\n      }\n      switch (typeof value === \"undefined\" ? \"undefined\" : _typeof(value)) {\n        case \"function\":\n          // not allowed in JSON protocol\n          // let's return some info in any case\n          return \"\".concat(\"function \", value.name || \"anonymous\", \"(\", Array(value.length + 1).join(\",arg\").slice(1), \"){}\");\n        // is this a primitive value ?\n        case \"boolean\":\n        case \"number\":\n        case \"string\":\n          // primitives cannot have properties\n          // so these are safe to parse\n          return value;\n        default:\n          // only null does not need to be stored\n          // for all objects check recursion first\n          // hopefully 255 calls are enough ...\n          if (!value || !window.__nflow_devtools_hook__.serialise.filter(value) || 255 < ++r) return undefined;\n          i = stack.indexOf(value);\n          // all objects not already parsed\n          if (i < 0) return stack.push(value) && value;\n          // all others are duplicated or cyclic\n          // mark them with index\n          return \"*R\" + i;\n      }\n    };\n  }\n})();"

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	/**
	 *  SITE <--> CONTENTSCRIPT communication channel
	 */

	exports.default = function (name) {

	  var api = {};
	  var onMessage = function onMessage() {};

	  api.inject = function (js) {
	    var script = document.createElement('script');
	    script.textContent = js;
	    (document.head || document.documentElement).appendChild(script);
	    script.parentNode.removeChild(script);
	    return api;
	  };

	  api.onMessage = (function (handler) {
	    return onMessage = handler;
	  }, api);

	  api.send = function (type, data) {
	    chrome.runtime.sendMessage({
	      type: type,
	      data: data,
	      source: name
	    });
	  };
	  window.addEventListener('message', function (event) {
	    // Only accept messages from the same frame
	    if (event.source !== window) {
	      return;
	    }
	    var message = event.data;
	    // Only accept messages that we know are ours
	    if ((typeof message === 'undefined' ? 'undefined' : _typeof(message)) !== 'object' || message === null || !message.source === name) {
	      return;
	    }
	    onMessage(message);
	    chrome.runtime.sendMessage(message);
	  });

	  return api;
	};

/***/ }
/******/ ]);