"use strict";
/* Note:
 * This module has a function, `next`, that is written at the top scope
 * and overwritten each time there's another callback. I chose to write it
 * this way to make sure I would be aware of each function's exit intentions.
 *
 * Once the module has passed the data, it'll exit to `cb`, the master callback.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var cmdExists = require('command-exists').sync, licenses = require('../../assets/licenses'), fs = require('fs'), cmd = require('child_process').exec, dns = require('dns');
var hasHub = cmdExists('git') ? true : false, hasGit = cmdExists('hub') ? true : false, cb = new Function, next = new Function, route = '', settings = {};
function output(pSettings, pRoute, pcb) {
    cb = pcb,
        next = checkGit;
    settings = pSettings;
    route = pRoute;
    // Create folder.
    !fs.existsSync(route) && fs.mkdirSync(route);
    console.log("-> Built folder!");
    // Create LICENSE.
    fs.appendFile(route + "/LICENSE", "" + licenses[settings.license].replace("USERNAME", settings.owner), function (err) { if (err)
        throw err; });
    console.log("-> Created LICENSE!");
    // Create README.md.
    fs.appendFile(route + "/README.md", "# " + settings.title + "\n\n" + settings.about, function (err) { if (err)
        throw err; });
    console.log("-> Created README.md!");
    next();
}
exports.default = output;
function checkGit() {
    next = checkCommit;
    if (hasGit && settings.git) {
        cmd("git init " + route, function () {
            console.log("-> Initialized git!");
            next();
        });
    }
    else {
        next();
    }
}
function checkCommit() {
    next = hasInternet;
    if (settings.git && settings.commit) {
        cmd("cd " + route + " && git commit -am \"Initial commit\"", function () {
            console.log("-> First commit created!");
            if (settings.hub)
                next();
        });
    }
    else {
        if (settings.hub)
            next();
    }
}
function hasInternet() {
    next = checkHub;
    console.log("-- Checking internet connection.");
    dns.resolve('www.google.com', function (err) {
        err ? (console.log("-> No connection, exiting."), cb())
            : (console.log("-> Connection found!"), next());
    });
}
function checkHub() {
    next = checkPush;
    if (hasHub && settings.hub) {
        cmd("cd " + route + " && hub create " + settings.titlePath, function () {
            console.log("-> Created repo \"" + settings.titlePath + "\" on GitHub!");
            next();
        });
    }
    else {
        next();
    }
    ;
}
;
function checkPush() {
    if (settings.push)
        cmd("cd " + route + " && git push origin master", function () {
            console.log("-> Pushed initial commit to GitHub!");
        });
    cb();
}
;
//# sourceMappingURL=output.module.js.map