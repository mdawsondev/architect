const defaults = require('./defaults');

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