const fs = require('fs');
const dotenv = require('dotenv');

function setProcessEnv(nameFile) {
    const envConfig = dotenv.parse(fs.readFileSync(nameFile));
    Object.assign(process.env, envConfig);
}

module.exports = setProcessEnv;
