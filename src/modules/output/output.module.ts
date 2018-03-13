const cmdExists = require('command-exists').sync,
      licenses  = require('./assets/licenses'),
      fs        = require('fs'),                 // File System
      cmd       = require('child_process').exec, // Command Line
      dns       = require('dns');                // DNS Connection

let hasHub: boolean = cmdExists('git') ? true : false,
    hasGit: boolean = cmdExists('hub') ? true : false,
    cb: Function,
    route: string   = '',
    settings: any   = {};

export default function output(pSettings: any, pRoute: string, pcb: Function) {
  
  cb       = pcb;
  settings = pSettings;
  route    = pRoute;

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

function checkGit() {
  if (hasGit && settings.git) {
    cmd(`git init ${route}`, () => {
      console.log("-> Initialized git!");
      checkCommit();
    });
  } else {
    checkCommit();
  }
}

function checkCommit() {
  if (settings.git && settings.commit) {
    cmd(`cd ${route} && git add -A && git commit -m "Initial commit"`, () => {
      console.log("-> First commit created!");
      if (settings.hub) hasInternet();
    });
  } else {
    if (settings.hub) hasInternet();
  }
}

function checkHub() {
  if (hasHub && settings.hub) {
    cmd(`cd ${route} && hub create ${settings.titlePath}`, () => {
      console.log(`-> Created repo "${settings.titlePath}" on GitHub!`);
      checkPush();
    });
  } else {
    cb();
  };
};

function checkPush() {
  if (settings.push) cmd(`cd ${route} && git push origin master`, () => {
    console.log("-> Pushed initial commit to GitHub!");
    cb();
  });
};

function hasInternet() {
  console.log("-- Checking internet connection.");
  dns.resolve('www.google.com', (err: any) => {
    err ? console.log("-X ERROR: NO CONNECTION ESTABLISHED.") : (console.log("-> Connection found!"), checkHub());
  });
}