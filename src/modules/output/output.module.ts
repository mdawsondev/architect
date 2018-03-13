/* Note:
 * This module has a function, `next`, that is written at the top scope
 * and overwritten each time there's another callback. I chose to write it
 * this way to make sure I would be aware of each function's exit intentions.
 * 
 * Once the module has passed the data, it'll exit to `cb`, the master callback.
 */

const cmdExists = require('command-exists').sync,
      licenses  = require('../../assets/licenses'),
      fs        = require('fs'),
      cmd       = require('child_process').exec,
      dns       = require('dns');

let hasHub: boolean = cmdExists('git') ? true : false,
    hasGit: boolean = cmdExists('hub') ? true : false,
    cb: Function    = new Function,
    next: Function  = new Function,
    route: string   = '',
    settings: any   = {};

export default function output(pSettings: any, pRoute: string, pcb: Function) {

  cb       = pcb,
  next     = checkGit;
  settings = pSettings;
  route    = pRoute;

  // Create folder.
  !fs.existsSync(route) && fs.mkdirSync(route);
  console.log("-> Built folder!")

  // Create LICENSE.
  fs.appendFile(`${route}/LICENSE`,
    `${licenses[settings.license].replace("USERNAME", settings.owner)}`,
    (err: any) => { if (err) throw err });
  console.log("-> Created LICENSE!")

  // Create README.md.
  fs.appendFile(`${route}/README.md`,
    `# ${settings.title}\n\n${settings.about}`,
    (err: any) => { if (err) throw err });
  console.log("-> Created README.md!")

  next();
}

function checkGit() {
  next = checkCommit;

  if (hasGit && settings.git) {
    cmd(`git init ${route}`, () => {
      console.log("-> Initialized git!");
      next();
    });
  } else {
    next();
  }
}

function checkCommit() {
  next = hasInternet;

  if (settings.git && settings.commit) {
    cmd(`cd ${route} && git commit -am "Initial commit"`, () => {
      console.log("-> First commit created!");
      if (settings.hub) next();
    });
  } else {
    if (settings.hub) next();
  }
}

function hasInternet() {
  next = checkHub;

  console.log("-- Checking internet connection.");
  dns.resolve('www.google.com', (err: any) => {
    err ? (console.log("-> No connection, exiting."), cb())
        : (console.log("-> Connection found!"), next());
  });
}

function checkHub() {
  next = checkPush;

  if (hasHub && settings.hub) {
    cmd(`cd ${route} && hub create ${settings.titlePath}`, () => {
      console.log(`-> Created repo "${settings.titlePath}" on GitHub!`);
      next();
    });
  } else {
    next();
  };
};

function checkPush() {
  if (settings.push) cmd(`cd ${route} && git push origin master`, () => {
    console.log("-> Pushed initial commit to GitHub!");
  });
  cb();
};