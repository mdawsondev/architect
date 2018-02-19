# Architect

Architect is a git turnkey for building GitHub repos through the CLI.

`node ./dist/app.min.js` or just run `run.bat`

This project is in development, and will eventually be moved to npm.

### Execution
* Your Name: Appears in the license.
* Project Title: The title of your README.md, and the name of your repo.
* (Unlisted) Repo Name: project-title output.
* About: A short description that appears in your README.md.
* License: Currently `MIT` or `none`.
* Location: Defaults to the current folder, accepts input as "C:\Folder\Folder\etc".
* git init: Initialize git in the new folder.
* init commit: Commit the new files we just made.
* hub init: Create a new repo on GitHub (requires *hub*).
* init push: Push initial files to your new GitHub repo.

### History
* *v1.0.0* - Minimal but functional release to be built around.
* *v1.1.0* - Rewrote entire code to modularize application and added a git/hub validation.
* *v1.1.1* - Swap arrows for function declarations.

### To-Do
* Send minified app to npm for global use.
* Compile .js into .exe for optional execution.
* Implement framework and Yeoman support for seamless setup.
* Add full license options.
* Add optional automatic folder structuring.
* Add optional automatic .gitignore generation.
* Add optional npm/yarn init with settings feed.