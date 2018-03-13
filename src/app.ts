'use strict';

import askQuestions   from './modules/ask-questions/askQuestions.module';
import processAnswers from './modules/process-answers/processAnswers.module';

const cmdExists = require('command-exists').sync,
      licenses  = require('./assets/licenses'),
      fs        = require('fs'), // File System
      cmd       = require('child_process').exec, // Command Line
      dns       = require('dns'); // DNS Connection

let hasHub:   boolean  = cmdExists('git') ? true : false,
    hasGit:   boolean  = cmdExists('hub') ? true : false,
    route:    string   = '',
    settings: any      = {};

askQuestions(settings, proceed);

function proceed() { // Since aQ pauses for input we need this callback.
  settings = processAnswers(settings);
  
  route = `${settings.location}/${settings.titlePath}`;
  
  output(route);
  checkGit(route);
}

function output(route: string) {
  
  !fs.existsSync(route) && fs.mkdirSync(route); // Create folder.
  console.log("-> Built folder!")

  fs.appendFile(`${route}/LICENSE`, // Create LICENSE.
    `${licenses[settings.license].replace("USERNAME", settings.owner)}`,
    (err: any) => { if (err) throw err });
  console.log("-> Created LICENSE!")

  fs.appendFile(`${route}/README.md`, // Create README.md.
    `# ${settings.title}\n\n${settings.about}`,
    (err: any) => { if (err) throw err });
  console.log("-> Created README.md!")
}

// All instances of r are "route" funneled through checkGit(route)!

function checkGit(r: any) {
  if (hasGit && settings.git) {
    cmd(`git init ${r}`, () => {
      console.log("-> Initialized git!");
      checkCommit(r);
    });
  } else {
    checkCommit(r);
  }
}

function checkCommit(r: any) {
  if (settings.git && settings.commit) {
    cmd(`cd ${r} && git add -A && git commit -m "Initial commit"`, () => {
      console.log("-> First commit created!");
      if (settings.hub) hasInternet(r);
    });
  } else {
    if (settings.hub) hasInternet(r);
  }
}

function checkHub(r: any) {
  if (hasHub && settings.hub) {
    cmd(`cd ${r} && hub create ${settings.titlePath}`, () => {
      console.log(`-> Created repo "${settings.titlePath}" on GitHub!`);
      checkPush(r);
    });
  } else {
    exitMessage();
  };
};

function checkPush(r: any) {
  if (settings.push) cmd(`cd ${r} && git push origin master`, () => {
    console.log("-> Pushed initial commit to GitHub!");
    exitMessage();
  });
};

function hasInternet(r: any) {
  console.log("-- Checking internet connection.");
  dns.resolve('www.google.com', (err: any) => {
    err ? console.log("-X ERROR: NO CONNECTION ESTABLISHED.") : (console.log("-> Connection found!"), checkHub(r));
  });
}

function exitMessage() {
  console.log(`\nProject ${settings.title} has completed setup, now exiting script.\n`);
}