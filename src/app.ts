'use strict';

import askQuestions   from './modules/ask-questions/askQuestions.module';
import processAnswers from './modules/process-answers/processAnswers.module';
import output         from './modules/output/output.module';

let route:    string   = '',
    settings: any      = {};

askQuestions(settings, proceed); // CB due to process time.

function proceed() {
  settings = processAnswers(settings);
  route    = `${settings.location}/${settings.titlePath}`;
  
  output(settings, route, () => {
    console.log(`\nProject ${settings.title} has completed setup, now exiting script.\n`);
  });
}