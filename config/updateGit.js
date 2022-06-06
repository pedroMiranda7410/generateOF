const system = require('../modules/system');
const user = require('../user.json');

var directoryOF = user.directoryOF;

module.exports.updateGitRepository = async() => {
    var cmd = `cd ${directoryOF} && git pull`;
    await system.execShellCommand(cmd);
}