export default function processAnswers(settings: any) {
  let licenseList = ["MIT", "gnu3", "Apache", "none"];
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
  return settings;
}