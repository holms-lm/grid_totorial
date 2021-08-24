const path = require('path');
const setProcessEnv = require('../env');

// Добавление ENV переменных в конфигурацию
setProcessEnv(path.join(__dirname, `../../.env.${process.env.NODE_ENV}`));

module.exports = {
  data: (context) => {
    const globalData = path.join(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}/index.json`);
    const env = { ...process.env };
    context.addDependency(globalData); // Force webpack to watch file
    const data = context.resourcePath.replace('.twig', '.json');
    context.addDependency(data); // Force webpack to watch file
    return Object.assign(
      context.fs.readJsonSync(globalData, {throws: false}) || {},
      context.fs.readJsonSync(data, {throws: false}) || {},
      env || {},
    );
  },
  namespaces: {
    'App': path.join(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}`),
  },
};
