/**
 * cmd: CMD Support
 * fs: File System Support
 * rl: Prompt Support
 * 
 */

const fs = require('fs'),
  rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }),
  cmd = require('child_process').exec,
  dns = require('dns');

let licns = require('./resources/licenses'),
  licnsList = ["MIT", "none"];

let settings = {
  owner: "John Smith",
  oTitle: "New Project",
  title: "new-project",
  about: "About my project...",
  license: "MIT",
  loc: __dirname,
  git: 1,
  hub: 0,
  commit: 0,
  push: 0
};

const questions = [
  [`\nquestion your name (${settings.owner}): `, "owner"],
  [`question project title (${settings.title}): `, "title"],
  [`question about (${settings.about}): `, "about"],
  [`question license (${settings.license}): `, "license"],
  [`question location (${settings.loc}): `, "loc"],
  [`question git init (y/n): `, "git"],
  [`question init commit (y/n): `, "commit"],
  [`question hub init (y/n): `, "hub"],
  [`question init push (y/n): `, "push"]
];

function askQs(qNum = 0) {
  const req = questions[qNum][0],
    reqType = questions[qNum][1];

  if (!validate(reqType)) {
    nextQ(qNum);
  } else {
    rl.question(req, (ans) => {
      settings[reqType] = sanitize(reqType, ans);
      nextQ(qNum);
    });
  }

};


function nextQ(qNum) {
  qNum !== questions.length - 1 ? askQs(qNum + 1) : (rl.close(), output());
}

function output() {
  let path = `${settings.loc}/${settings.title}`,
    cdPath = `cd ${path}`;
  console.log("HEY AT " + path);
  if (!fs.existsSync(path)) fs.mkdirSync(path);

  fs.appendFile(`${path}/LICENSE`, `${licns[settings.license].replace("USERNAME", settings.owner)}`, (err) => {
    if (err) throw err;
  });

  fs.appendFile(`${path}/README.md`, `# ${settings.oTitle}\n\n${settings.about}`, (err) => {
    if (err) throw err;
  });

  //console.debug(`\n${JSON.stringify(settings)}\n`);

  if (settings.git) cmd(`git init ${path}`, () => {
    console.log("Success: git init");
    if (settings.commit) cmd(`${cdPath} && git add -A && git commit -m "Initial commit"`, () => {
      console.log("Success: git commit");
      webCheck(webOutput, cdPath)
    });
  });
}

function webOutput(cdPath) {
  if (settings.hub) cmd(`${cdPath} && hub create ${settings.title}`, () => {
    console.log(`Success: Created GitHub repo "${settings.title}"`);
    if (settings.push) cmd(`${cdPath} && git push origin master`, () => {
      console.log("Success: Pushed initial commit to GitHub");
    });
  })
}

function webCheck(cb, cdPath) {
  console.log("Status: Checking internet connection");
  dns.resolve('www.google.com', (err) => {
    err ? console.log("Failure: No connection detected") : (console.log("Success: Connection established"), cb(cdPath));
  });
}

function sanitize(type, ans) {
  if (ans === '') return settings[type]; // Use Default Settings
  switch (type) {
    case "commit":
    case "git":
    case "hub":
    case "push": {
      return ans === "n" ? 0 : 1;
    }
    case "license": {
      if (licnsList.indexOf(ans) === -1) return settings.license;
    }
    case "title": {
      settings['oTitle'] = ans;
      return ans.replace(/ /g, "-").toLowerCase();
    }
    default: {
      return ans;
    }
  }
}

function validate(type) {
  switch (type) {
    case "hub":
      return settings.git;
    default:
      return true;
  }
}

askQs()