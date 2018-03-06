# Environment Build

This guide documents *my* preferred standard web development environment. `git` and `npm` are presumed to be installed, `yarn` is implemented for dev control. The expansion of Architect will push towards a `Yeoman` inclusive structure, but caters mostly to what I think is the ideal vanilla setup (open to discussion).

## Details

* Bundling: Webpack
* Framework: ES6 + TypeScript
* JS Linting: TSLint
* Task Management: npm Scripts
* Testing Kit: Jest
* Transpilation: TypeScript
* Watcher: Chokidar

**Webpack** and **npm Scripts** were chosen in place of Gulp and Grunt as the combination better serves modern task management and bundling.
**ES6** and **TypeScript** were chosen as the default framework because ES6 is considered modern JavaScript, and TypeScript nicely compiles ES6 while implementing several of its own noteworthy contributions.
**TSLint** and **Jest** were chosen in place of ESLint and Jasmine/Mocha because TSLint better serves the purposes of checking untranspiled TS files, and Jest is a much leaner unit testing kit that comes with a variety of features.
**Chokidar** was chosen in place of various `--watch` packages; it will be further tested and possibly replace default `--watch` features in the script list.

## Install

1. `git init`
2. `npm install --save-dev yarn`
3. `yarn init -y`
4. `yarn add --dev jest typescript webpack tslint nodemon`
5. `yarn add --dev chokidar chokidar-cli cross-env npm-run-all`
6. `yarn tsc --init`
7. `yarn tslint --init`
8. `mkdir app tools app/components app/tests build dist`
9. `touch .gitignore server.js ./app/index.ts ./app/index.html ./app/tests/index.test.js ./tools/buildHtml.js`

### Scripts

```JSON
"scripts": {
  "start": "npm-run-all --parallel lint:watch transpile:watch",
  "build": "webpack",
  "build-html": "node ./tools/buildHtml.js",
  "build-html:prod": "yarn cross-env NODE_ENV=production node tools/buildHtml.js",
  "clean-dist": "rm -rf ./dist && mkdir dist",
  "clean-build": "rm -rf ./build && mkdir build",
  "clean": "yarn npm-run-all clean-dist clean-build",
  "lint": "yarn tslint ./app/**/*.js",
  "lint:watch": "yarn chokidar ./app/**/*.ts -c \"yarn lint\" --initial --verbose",
  "prebuild": "yarn npm-run-all clean-dist build-html",
  "prebuild:prod": "yarn npm-run-all clean-build build-html:prod",
  "postbuild": "yarn server",
  "postbuild:prod": "yarn server:prod",
  "test": "yarn jest ./app/**/*.test.js --compilers js:babel-core/register",
  "test:watch": "yarn test -- --watch",
  "transpile": "yarn tsc",
  "transpile:watch": "yarn transpile -- --watch",
  "server": "yarn nodemon server.js",
  "server:prod": "yarn cross-env NODE_ENV=production nodemon server.js"
},
```

### .gitignore

```Text
# Numerous always-ignore extensions
*.diff
*.err
*.orig
*.log
*.rej
*.swo
*.swp
*.vi
*~
*.sass-cache
node_modules/
.tmp/

# OS or Editor folders
.DS_Store
Thumbs.db
.cache
.project
.settings
.tmproj
*.esproj
nbproject
*.sublime-project
*.sublime-workspace
*.komodoproject
.komodotools
_notes
dwsync.xml
```