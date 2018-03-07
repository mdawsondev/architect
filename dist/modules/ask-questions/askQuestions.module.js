"use strict";
/* --- MODULE INSTRUCTIONS ---

1. Import questions and default answers.
2. Import `rl` so we can ask the user for input.
3. Wait for module to be called by the application via `askQuestions`;
4. Process questions via `processQuestions`;
5. Return a list of answers (settings).

That's it! The next module (the callback)
will prossess the data. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = askQuestions;
var defaults = require('../../assets/defaults'), allQs = require('../../assets/questions'), rl = require('readline').createInterface({ input: process.stdin,
    output: process.stdout });
var nextModule, // Stored to avoid passing as param.
remainQs = allQs; // Stored to avoid destroying const data.
function askQuestions(data, cb) {
    nextModule = cb;
    askRemainingQuestions(remainQs, data);
}
function askRemainingQuestions(singleQ, data) {
    var request = singleQ[0][0], requestType = singleQ[0][1];
    rl.question(request, function (answer) {
        // Setting data[requestType]; not an equality check.
        data[requestType] = answer ? answer : defaults[requestType];
        remainQs.shift();
        if (remainQs.length > 0) {
            askRemainingQuestions(remainQs, data);
        }
        else {
            rl.close();
            nextModule(data);
        }
    });
}
//# sourceMappingURL=askQuestions.module.js.map