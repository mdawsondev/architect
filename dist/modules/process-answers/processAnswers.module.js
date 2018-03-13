"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processAnswers(settings) {
    var licenseList = ["MIT", "gnu3", "Apache", "none"];
    for (var e in settings) {
        switch (e) {
            case 'license':
                if (licenseList.indexOf(settings.license) === -1)
                    settings.license = "MIT";
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
    return settings;
}
exports.default = processAnswers;
//# sourceMappingURL=processAnswers.module.js.map