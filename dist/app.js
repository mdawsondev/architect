'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var askQuestions_module_1 = __importDefault(require("./modules/ask-questions/askQuestions.module"));
var processAnswers_module_1 = __importDefault(require("./modules/process-answers/processAnswers.module"));
var cmdExists = require('command-exists').sync, licenses = require('./assets/licenses'), fs = require('fs'), // File System
cmd = require('child_process').exec, // Command Line
dns = require('dns'); // DNS Connection
var hasHub = cmdExists('git') ? true : false, hasGit = cmdExists('hub') ? true : false, settings = {};
(function init() {
    askQuestions_module_1.default(settings, proceed);
}());
// Ask Questions is now a module.
// Process Answers is now a module.
function proceed() {
    settings = processAnswers_module_1.default(settings);
    output();
}
function output() {
    var route = settings.location + "/" + settings.titlePath;
    console.log("");
    !fs.existsSync(route) && fs.mkdirSync(route); // Create folder.
    console.log("-> Built folder!");
    fs.appendFile(route + "/LICENSE", // Create LICENSE.
    "" + licenses[settings.license].replace("USERNAME", settings.owner), function (err) { if (err)
        throw err; });
    console.log("-> Created LICENSE!");
    fs.appendFile(route + "/README.md", // Create README.md.
    "# " + settings.title + "\n\n" + settings.about, function (err) { if (err)
        throw err; });
    console.log("-> Created README.md!");
    checkGit(route);
}
// All instances of r are "route" funneled through checkGit(route)!
function checkGit(r) {
    if (hasGit && settings.git) {
        cmd("git init " + r, function () {
            console.log("-> Initialized git!");
            checkCommit(r);
        });
    }
    else {
        checkCommit(r);
    }
}
function checkCommit(r) {
    if (settings.git && settings.commit) {
        cmd("cd " + r + " && git add -A && git commit -m \"Initial commit\"", function () {
            console.log("-> First commit created!");
            if (settings.hub)
                hasInternet(r);
        });
    }
    else {
        if (settings.hub)
            hasInternet(r);
    }
}
function checkHub(r) {
    if (hasHub && settings.hub) {
        cmd("cd " + r + " && hub create " + settings.titlePath, function () {
            console.log("-> Created repo \"" + settings.titlePath + "\" on GitHub!");
            checkPush(r);
        });
    }
    else {
        exitMessage();
    }
    ;
}
;
function checkPush(r) {
    if (settings.push)
        cmd("cd " + r + " && git push origin master", function () {
            console.log("-> Pushed initial commit to GitHub!");
            exitMessage();
        });
}
;
function hasInternet(r) {
    console.log("-- Checking internet connection.");
    dns.resolve('www.google.com', function (err) {
        err ? console.log("-X ERROR: NO CONNECTION ESTABLISHED.") : (console.log("-> Connection found!"), checkHub(r));
    });
}
function exitMessage() {
    console.log("\nProject " + settings.title + " has completed setup, now exiting script.\n");
}
//# sourceMappingURL=app.js.map