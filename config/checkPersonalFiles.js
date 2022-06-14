const system = require('../modules/system');
const fs = require('fs');

module.exports.checkBashFunctions = async () => {

    try {

        const userConfig = require('../config/userConfig.json');
        const defaultFiles = require('./defaultFiles');

        userConfig.terminalConfig.forEach(config => {

            var directory = `${userConfig.home}/${config}`;

            if (fs.existsSync(directory)) {

                system.execShellCommand(`cd && cat ${config}`).then(response => {

                    if (!response.includes("git () {")) {

                        response += defaultFiles.defaultGitFunction;

                        fs.writeFile(directory, response, function (err) {
                            if (err) { return console.log(err); }
                        });

                    }

                });

            }

        });

    } catch (error) {
        return false;
    }

    return true;

}

module.exports.checkPersonalFiles = async () => {

    var hasPassword = false;
    var hasUserJson = false;

    try {

        const userConfig = require('../config/userConfig.json');
        const defaultFiles = require('./defaultFiles.js');

        var directoryOF = userConfig.directoryOF;

        var cmd = `cd ${directoryOF} && ls`;
        var result = await system.execShellCommand(cmd);
        var files = result.split("\n");

        var cmdConfig = `cd ${directoryOF}/config && ls`;
        var resultConfig = await system.execShellCommand(cmdConfig);
        var filesConfig = resultConfig.split("\n");

        files.forEach(file => {
            if (file.includes("user.json"))
                hasUserJson = true;
        });

        filesConfig.forEach(file => {
            if (file.includes("passwords.json"))
                hasPassword = true;
        });

        if (!hasPassword) {

            var filePath = `${directoryOF}/config/passwords.json`;

            fs.writeFile(filePath, defaultFiles.defaultPasswords, function (err) {
                if (err) { return console.log(err); }
            });

        }

        if (!hasUserJson) {

            var filePath = `${directoryOF}/user.json`;

            fs.writeFile(filePath, defaultFiles.defaultUserJson, function (err) {
                if (err) { return console.log(err); }
            });

        }

        return true;

    } catch (error) {
        return false;
    }

}
