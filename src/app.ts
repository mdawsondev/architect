// This is obviously not prepared yet, will work on conversion from JS to TS for next update!

const cmdExists = require('command-exists').sync,
      defaults = require('./resources/defaults'),
      questions = require('./resources/questions'),
      licenses = require('./resources/licenses'),
      fs = require('fs'), // File System
      rl = require('readline').createInterface({ // Read Line
        input: process.stdin,
        output: process.stdout
      }),
      cmd = require('child_process').exec, // Command Line
      dns = require('dns'); // DNS Connection

let hasHub = cmdExists('git') ? 1 : 0,
    hasGit = cmdExists('hub') ? 1 : 0,
    settings = {};

(function init() { // Initialize code; no reason to bother with init();.
  askQuestions(questions);
}());

function askQuestions(q) {
    const req = q[0][0],
          reqType = q[0][1];
    rl.question(req, (ans) => {
      settings[reqType] = ans ? ans : defaults[reqType];
      questions.shift();
      questions.length > 0 ? askQuestions(questions) : (rl.close(), processAnswers());
    });
}

function processAnswers() {
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
}

function output() {
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
}

// All instances of r are "route" funneled through checkGit(route)!

function checkGit(r) {
  if (hasGit && settings.git) {
    cmd(`git init ${r}`, () => {
      console.log("-> Initialized git!");
      checkCommit(r);      
    });
  } else {
    checkCommit(r);    
  }
}

function checkCommit(r) {
  if (settings.git && settings.commit) {
    cmd(`cd ${r} && git add -A && git commit -m "Initial commit"`, () => {
      console.log("-> First commit created!");
      if (settings.hub) hasInternet(r);
    });
  } else {
    if (settings.hub) hasInternet(r);
  }
}

function checkHub(r) {
  if (hasHub && settings.hub) {
    cmd(`cd ${r} && hub create ${settings.titlePath}`, () => {
      console.log(`-> Created repo "${settings.titlePath}" on GitHub!`);
      checkPush(r);
    });
  } else {
    exitMessage();
  };
};

function checkPush(r) {
    if (settings.push) cmd(`cd ${r} && git push origin master`, () => {    
      console.log("-> Pushed initial commit to GitHub!");
      exitMessage();
    });
};

function hasInternet(r) {
  console.log("-- Checking internet connection.");
  dns.resolve('www.google.com', err => {
    err ? console.log("-X ERROR: NO CONNECTION ESTABLISHED.") : (console.log("-> Connection found!"), checkHub(r));
  });
}

function exitMessage() {
  console.log(`\nProject ${settings.title} has completed setup, now exiting script.\n`);
}