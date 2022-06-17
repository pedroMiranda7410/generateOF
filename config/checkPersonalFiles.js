module.exports.checkBashFunctions = async () => {

    try {

        const userConfig = require('../config/userConfig.json');
        const fileManager = require('../modules/fileManager.js');
        const defaultFiles = require('./defaultFiles');
        const system = require('../modules/system');

        userConfig.terminalConfig.forEach(config => {

            var directory = `${userConfig.home}/${config}`;

            if (fileManager.existsSync(directory)) {

                system.execShellCommand(`cd && cat ${config}`).then(response => {

                    if (!response.includes("git () {")) {
                        response += defaultFiles.defaultGitFunction;
                        fileManager.writeFile(directory, response);
                    }

                });

            }

        });

    } catch (error) {
        return false;
    }

    return true;

}

module.exports.checkNodeModules = async () => {

    try {

        const userConfig = require('../config/userConfig.json');
        const fileManager = require('../modules/fileManager.js');
        const system = require('../modules/system');

        var directory = `${userConfig.directoryOF}/node_modules`;

        if (!fileManager.existsSync(directory)) {

            system.execShellCommand(`npm install --force`).then(response => {
                return true;
            });

        }

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
        const fileManager = require('../modules/fileManager.js');
        const defaultFiles = require('./defaultFiles.js');
        const system = require('../modules/system');

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
            fileManager.writeFile(filePath, defaultFiles.defaultPasswords);
        }

        if (!hasUserJson) {
            var filePath = `${directoryOF}/user.json`;
            fileManager.writeFile(filePath, defaultFiles.defaultUserJson);
        }

        return true;

    } catch (error) {
        return false;
    }

}
