'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var askQuestions_module_1 = __importDefault(require("./modules/ask-questions/askQuestions.module"));
var processAnswers_module_1 = __importDefault(require("./modules/process-answers/processAnswers.module"));
var output_module_1 = __importDefault(require("./modules/output/output.module"));
var route = '', settings = {};
askQuestions_module_1.default(settings, proceed); // CB due to process time.
function proceed() {
    settings = processAnswers_module_1.default(settings);
    route = settings.location + "/" + settings.titlePath;
    output_module_1.default(settings, route, function () {
        console.log("\nProject " + settings.title + " has completed setup, now exiting script.\n");
    });
}
//# sourceMappingURL=app.js.map