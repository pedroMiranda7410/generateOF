const system = require('../modules/system');
const user = require('../user.json');
const fs = require('fs');

var directoryOF = user.directoryOF;

var defaultPasswords = `
{
    "sisbb": "",
    "hermes": ""
}`;

var defaultUserJson = `
{
    {
        "directory": "",
        "directoryOF": "",
        "yourName": "",
        "yourKey": "",
        "userHermes": "",
        "choosenDate": "",
        "otherDate": "",
        "operations": [],
        "repositories": [],
        "tasks": [],
        "baseXLS": "",
        "hermesXLS": "",
        "repeatFiles": "",
        "metaPoints": "",
        "points": "",
        "files": []
    }
}`;

module.exports.checkPersonalFiles = async () => {

    var cmd = `cd ${directoryOF} && ls`;
    var result = await system.execShellCommand(cmd);
    var files = result.split("\n");

    var cmdConfig = `cd ${directoryOF}/config && ls`;
    var resultConfig = await system.execShellCommand(cmdConfig);
    var filesConfig = resultConfig.split("\n");

    var hasPassword = false;
    var hasUserJson = false;

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

        fs.writeFile(filePath, defaultPasswords, function (err) {
            if (err) { return console.log(err); }
        });

    }

    if (!hasUserJson) {

        var filePath = `${directoryOF}/user.json`;

        fs.writeFile(filePath, defaultUserJson, function (err) {
            if (err) { return console.log(err); }
        });

    }

}
