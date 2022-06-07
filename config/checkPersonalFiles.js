const system = require('../modules/system');
const fs = require('fs');

var defaultPasswords = `
{
    "sisbb": "",
    "hermes": ""
}`;

module.exports.checkPersonalFiles = async () => {

    var hasPassword = false;

    try {
        const user = require('../user.json');
        var directoryOF = user.directoryOF;
    } catch (error) {
        return false;
    }

    var cmd = `cd ${directoryOF} && ls`;
    var result = await system.execShellCommand(cmd);
    var files = result.split("\n");

    var cmdConfig = `cd ${directoryOF}/config && ls`;
    var resultConfig = await system.execShellCommand(cmdConfig);
    var filesConfig = resultConfig.split("\n");

    files.forEach(file => {

    });

    filesConfig.forEach(file => {
        if (file.includes("passwords.json"))
            hasPassword = true;
    });

    if (!hasPassword) {

        var filePath = `${directoryOF}/config/passwords.json`;

        fs.writeFile(filePath, defaultPasswords, function (err) {
            if (err) { return console.log(err); }
        });

    }

    return true;

}
