/* --- MODULE INSTRUCTIONS ---

1. Import questions and default answers.
2. Import `rl` so we can ask the user for input.
3. Wait for module to be called by the application via `askQuestions`;
4. Process questions via `processQuestions`;
5. Return a list of answers (settings).

That's it! The next module (the callback)
will prossess the data. */

export default askQuestions;

const defaults = require('../../assets/defaults'),
      allQs    = require('../../assets/questions'),
      rl       = require('readline').createInterface({ input:  process.stdin,
                                                       output: process.stdout });

let nextModule: Function,  // Stored to avoid passing as param.
    remainQs: any = allQs; // Stored to avoid destroying const data.

function askQuestions(data: any, cb: Function) {
  nextModule = cb;
  askRemainingQuestions(remainQs, data);
}

function askRemainingQuestions(singleQ: any, data: any) {
  const request:     string = singleQ[0][0],
        requestType: string = singleQ[0][1];

  rl.question(request, (answer: any) => {
    // Setting data[requestType]; not an equality check.
    data[requestType] = answer ? answer : defaults[requestType];
    remainQs.shift();
    if (remainQs.length > 0) {
      askRemainingQuestions(remainQs, data)
    } else {
      rl.close();
      nextModule(data);
    }
  });
}
