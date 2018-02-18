/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__dirname) {module.exports = {
  owner: "John Smith",
  title: "New Project",
  pathTitle: "new-project",
  about: "About my project...",
  license: "MIT",
  location: __dirname,
  git: 1,
  hub: 0,
  commit: 0,
  push: 0
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const cmdExists = __webpack_require__(4).sync,
      defaults = __webpack_require__(2),
      questions = __webpack_require__(6),
      licenses = __webpack_require__(7),
      fs = __webpack_require__(1), // File System
      rl = __webpack_require__(8).createInterface({ // Read Line
        input: process.stdin,
        output: process.stdout
      }),
      cmd = __webpack_require__(0).exec, // Command Line
      dns = __webpack_require__(9); // DNS Connection

let hasHub = cmdExists('git') ? 1 : 0,
    hasGit = cmdExists('hub') ? 1 : 0,
    settings = {};

init = () => {
  askQuestions(questions);
};

askQuestions = q => {
    const req = q[0][0],
          reqType = q[0][1];
    rl.question(req, (ans) => {
      settings[reqType] = ans ? ans : defaults[reqType];
      questions.shift();
      questions.length > 0 ? askQuestions(questions) : (rl.close(), processAnswers());
    });
};

processAnswers = () => {
  let licenseList = ["MIT", "none"];
  for (let e in settings) {
    switch (e) {
      case 'license':
        if (licenseList.indexOf(settings.license) === -1) settings.license = "MIT";
        break;
      case 'title':
        settings.titlePath = settings[e].toLowerCase().replace(/ /g, '-').trim();
        break;
      case 'git':
      case 'commit':
      case 'hub':
      case 'push':
        settings[e] === 'y' ? settings[e] = 1 : settings[e] = 0;
        break;
    }
  }
  output();
};

output = () => {
  let route = `${settings.location}/${settings.titlePath}`;
  console.log("");

  !fs.existsSync(route) && fs.mkdirSync(route); // Create folder.
  console.log("-> Built folder!")

  fs.appendFile(`${route}/LICENSE`, // Create LICENSE.
    `${licenses[settings.license].replace("USERNAME", settings.owner)}`,
    err => { if (err) throw err });
  console.log("-> Created LICENSE!")

  fs.appendFile(`${route}/README.md`, // Create README.md.
    `# ${settings.title}\n\n${settings.about}`,
    err => { if (err) throw err });
  console.log("-> Created README.md!")

  checkGit(route);
};

// All instances of r are "route" funneled through checkGit(route)!

checkGit = (r) => {
  if (hasGit && settings.git) {
    cmd(`git init ${r}`, () => {
      console.log("-> Initialized git!");
      checkCommit(r);      
    });
  } else {
    checkCommit(r);    
  }
}

checkCommit = (r) => {
  if (settings.git && settings.commit) {
    cmd(`cd ${r} && git add -A && git commit -m "Initial commit"`, () => {
      console.log("-> First commit created!");
      if (settings.hub) hasInternet(r);
    });
  } else {
    if (settings.hub) hasInternet(r);
  }
}

checkHub = (r) => {
  if (hasHub && settings.hub) {
    cmd(`cd ${r} && hub create ${settings.titlePath}`, () => {
      console.log(`-> Created repo "${settings.titlePath}" on GitHub!`);
      checkPush(r);
    });
  } else {
    exitMessage();
  };
};

checkPush = (r) => {
    if (settings.push) cmd(`cd ${r} && git push origin master`, () => {    
      console.log("-> Pushed initial commit to GitHub!");
      exitMessage();
    });
};

hasInternet = (r) => {
  console.log("-- Checking internet connection.");
  dns.resolve('www.google.com', err => {
    err ? console.log("-X ERROR: NO CONNECTION ESTABLISHED.") : (console.log("-> Connection found!"), checkHub(r));
  });
}

exitMessage = () => {
  console.log(`\nProject ${settings.title} has completed setup, now exiting script.\n`);
}

init();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var exec = __webpack_require__(0).exec;
var execSync = __webpack_require__(0).execSync;
var fs = __webpack_require__(1);
var access = fs.access;
var accessSync = fs.accessSync;
var constants = fs.constants || fs;

var isUsingWindows = process.platform == 'win32'

var fileNotExists = function(commandName, callback){
    access(commandName, constants.F_OK,
    function(err){
        callback(!err);
    });
};

var fileNotExistsSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK);
        return false;
    }catch(e){
        return true;
    }
};

var localExecutable = function(commandName, callback){
    access(commandName, constants.F_OK | constants.X_OK,
        function(err){
        callback(null, !err);
    });
};

var localExecutableSync = function(commandName){
    try{
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    }catch(e){
        return false;
    }
}

var commandExistsUnix = function(commandName, callback) {

    fileNotExists(commandName, function(isFile){

        if(!isFile){
            var child = exec('command -v ' + commandName +
                  ' 2>/dev/null' +
                  ' && { echo >&1 \'' + commandName + ' found\'; exit 0; }',
                  function (error, stdout, stderr) {
                      callback(null, !!stdout);
                  });
            return;
        }

        localExecutable(commandName, callback);
    });

}

var commandExistsWindows = function(commandName, callback) {
  var child = exec('where ' + commandName,
    function (error) {
      if (error !== null){
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  )
}

var commandExistsUnixSync = function(commandName) {
  if(fileNotExistsSync(commandName)){
      try {
        var stdout = execSync('command -v ' + commandName +
              ' 2>/dev/null' +
              ' && { echo >&1 \'' + commandName + ' found\'; exit 0; }'
              );
        return !!stdout;
      } catch (error) {
        return false;
      }
  }

  return localExecutableSync(commandName);

}

var commandExistsWindowsSync = function(commandName, callback) {
  try {
      var stdout = execSync('where ' + commandName);
      return !!stdout;
  } catch (error) {
      return false;
  }
}

module.exports = function commandExists(commandName, callback) {
  if (!callback && typeof Promise !== 'undefined') {
    return new Promise(function(resolve, reject){
      commandExists(commandName, function(error, output){
        if (output) {
          resolve(commandName);
        } else {
          reject(error);
        }
      });
    });
  }
  if (isUsingWindows) {
    commandExistsWindows(commandName, callback);
  } else {
    commandExistsUnix(commandName, callback);
  }
};

module.exports.sync = function(commandName) {
  if (isUsingWindows) {
    return commandExistsWindowsSync(commandName);
  } else {
    return commandExistsUnixSync(commandName);
  }
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

const defaults = __webpack_require__(2);

module.exports = [
  [`\nquestion your name (${defaults.owner}): `, "owner"],
  [`question project title (${defaults.title}): `, "title"],
  [`question about (${defaults.about}): `, "about"],
  [`question license (${defaults.license}): `, "license"],
  [`question location (${defaults.location}): `, "location"],
  [`question git init (Y/n): `, "git"],
  [`question init commit (y/N): `, "commit"],
  [`question hub init (y/N): `, "hub"],
  [`question init push (y/N): `, "push"]
];

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = {
  MIT: `MIT License
Copyright (c) 2018 USERNAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  none: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>`
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("readline");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("dns");

/***/ })
/******/ ]);