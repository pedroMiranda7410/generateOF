const system = require('../modules/system');
const userConfig = require('../config/userConfig.json');

var directoryOF = userConfig.directoryOF;

module.exports.updateGitRepository = async() => {
    var cmd = `cd ${directoryOF} && git pull`;
    await system.execShellCommand(cmd);
}