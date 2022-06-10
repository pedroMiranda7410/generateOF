const user = require('../user.json');
const system = require('./system.js');
const fs = require('fs');

var directory = user.directory;
var directoryOF = user.directoryOF;
var yourName = user.yourName;
var yourKey = user.yourKey;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
var tasks = user.tasks;
var operations = user.operations;
var repositories = user.repositories;
let baseXLS = user.baseXLS;
let hermesXLS = user.hermesXLS;
let repeatFiles = user.repeatFiles;
let userHermes = user.userHermes;
let metaPoints = user.metaPoints;

module.exports.cleanSpreedsheet = (worksheet) => {

    for (var i = 0; i < 50; i++) {
        let row = worksheet.getRow(i);
        row.getCell(3).value = "";
        row.getCell(4).value = "";
        row.getCell(5).value = "";
        row.getCell(7).value = "";
        row.getCell(8).value = "";
        row.getCell(11).value = "";
        row.getCell(12).value = "";
        row.commit();
    }

}

module.exports.writeToFiles = (QTD, points, options, tmpFile, files, filesTXT, worksheet, rowCounter) => {

    if (QTD > 0) {

        tmpFile += `${filesTXT}\n ${files}\n`;
        tmpFile += `    Total: ${QTD} arquivos\n`;
        tmpFile += `    Pontuação: ${QTD * points} SISBB\n\n`;

    }

    return { 'tmpFile': tmpFile, 'rowCounter': rowCounter };

}

module.exports.writeToXLS = (QTD, options, files, worksheet, rowCounter) => {

    if (QTD > 0) {

        let row = worksheet.getRow(rowCounter);
        row.getCell(3).value = options[0];
        row.getCell(4).value = options[1];
        row.getCell(5).value = options[2];
        row.getCell(7).value = options[3];
        row.getCell(8).value = options[4];
        row.getCell(11).value = QTD;
        row.getCell(12).value = files;
        row.commit();
        rowCounter++;

    }

    return { 'rowCounter': rowCounter };

}

module.exports.addHistoryRito = (tasks, ritosList, worksheet, rowCounter) => {

    var tasksStr = "";

    tasks.forEach(history => {
        tasksStr += history;
    });

    ritosList.forEach(rito => {

        let row = worksheet.getRow(rowCounter);
        row.getCell(3).value = rito[0];
        row.getCell(4).value = rito[1];
        row.getCell(5).value = rito[2];
        row.getCell(7).value = rito[3];
        row.getCell(8).value = rito[4];
        row.getCell(11).value = tasks.length;
        row.getCell(12).value = tasksStr;
        row.commit();
        rowCounter++;

    });

    return rowCounter;

}

module.exports.updateUserJsonFile = async (points, files) => {

    var opStr = "";

    if (operations) {
        var opArray = operations.toString().split(",");

        opStr += "[";
        opArray.forEach(operation => {
            operation = operation.replace("\n", "");
            opStr += `"${operation}\\n",`;
        });
        opStr = opStr.slice(0, -1);
        opStr += "]";
    } else { opStr = "[]" }

    var repoStr = "";

    if (repositories) {
        var repoArray = repositories.toString().split(",");

        repoStr += "[";
        repoArray.forEach(repository => {
            repository = repository.replace("\n", "");
            repoStr += `"${repository}\\n",`;
        });
        repoStr = repoStr.slice(0, -1);
        repoStr += "]";
    } else { repoStr = "[]" }

    var histStr = "";

    if (tasks) {
        var histArray = tasks.toString().split(",");

        histStr += "[";
        histArray.forEach(history => {
            history = history.replace("\n", "");
            histStr += `"${history}\\n",`;
        });
        histStr = histStr.slice(0, -1);
        histStr += "]";
    } else { histStr = "[]" }

    var filesStr = "";

    if (files) {
        var filesArray = files.toString().split(",");

        filesStr += `[`;
        filesArray.forEach(file => {
            file = file.substring(1);
            file = file.replace("\t", "");
            filesStr += `"${file}",`;
        });
        filesStr = filesStr.slice(0, -1);
        filesStr += `]`;
    } else { filesStr = "[]" }

    if (!repeatFiles)
        repeatFiles = "false";

    if (!metaPoints)
        metaPoints = 285;

    var userJsonFile = `{
      "directory": "${directory}",
      "directoryOF": "${directoryOF}",
      "yourName": "${yourName}",
      "yourKey": "${yourKey}",
      "userHermes": "${userHermes}",
      "choosenDate": "${choosenDate}",
      "otherDate": "${otherDate}",
      "operations": ${opStr},
      "repositories": ${repoStr},
      "tasks": ${histStr},
      "baseXLS": "${baseXLS}",
      "hermesXLS": "${hermesXLS}",
      "repeatFiles": "${repeatFiles}",
      "metaPoints": "${metaPoints}",
      "points": "${points}",
      "files": ${filesStr}
  }`;

    var filePath = `${directoryOF}/user.json`;

    await system.execShellCommand('find . -name "user.json" -type f -delete');

    fs.writeFile(filePath, userJsonFile, function (err) {
        if (err) { return console.log(err); }
    });

}
