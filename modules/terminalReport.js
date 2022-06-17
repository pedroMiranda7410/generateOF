const userConfig = require('../config/userConfig.json');
const user = require('../user.json');
const system = require('./system.js');
const utils = require('./utils.js');

var yourName = userConfig.yourName;
var yourKey = userConfig.yourKey;

var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
let points = user.points;

let files = user.files;

module.exports.printEstimateTerminalReport = async (totalQtdBkp, othersFinalQTD, SISBBPoints, gitFiles) => {

    var nome = await system.execShellCommand(`echo -n 👤 Nome: ${yourName}`);
    var chave = await system.execShellCommand(`echo -n 🔑 Chave: ${yourKey}`);
    var periodo = await system.execShellCommand(`echo -n 📆 Período: ${utils.formatDateTerminalReport(choosenDate)} à ${utils.formatDateTerminalReport(otherDate)}`);

    var date1 = new Date();
    var date2 = new Date(otherDate);

    const diffDays = utils.getBusinessDatesCount(date1, date2);

    var tempo = "";

    if (diffDays > 0) {
        tempo = await system.execShellCommand(`echo -n ⏳ Tempo restante: ${diffDays} dias`);
    } else {
        tempo = await system.execShellCommand(`echo -n ⌛ Tempo restante: 🚫`);
    }

    var arquivos = await system.execShellCommand(`echo -n 📦 Arquivos: ${totalQtdBkp} arquivos`);

    if (othersFinalQTD > 0)
        arquivos = await system.execShellCommand(`echo -n 📦 Arquivos: ${totalQtdBkp} + '\x1b[33m'${othersFinalQTD}'\x1b[0m' arquivos`);

    var char = utils.returnSISBBStatus(diffDays, SISBBPoints);
    var pontuacao = await system.execShellCommand(`echo -n 🎯 Pontuação: ${SISBBPoints}pts ${char[0]}`);

    if (char[1]) {
        pontuacao = await system.execShellCommand(`echo -n 🎯 Pontuação: ${SISBBPoints}pts ${char[0]} ${char[1]}`);
    }

    if (char[1] && char[2]) {
        pontuacao = await system.execShellCommand(`echo -n 🎯 Pontuação: ${SISBBPoints}pts ${char[0]} ${char[1]}${char[2]}`);
    }

    if (points == undefined || points == "undefined")
        points = 0;

    var pointsDiff = SISBBPoints - points;
    var pontuacaoArr = pontuacao.split("pts");

    if (files == undefined || files == "undefined")
        files = [];

    var auxFiles = [];

    gitFiles.forEach(gitFile => {

        var alreadyHas = false;

        gitFile = gitFile.replace("\t", "");
        gitFile = gitFile.substring(1);

        files.forEach(file => {
            if (file == gitFile) { alreadyHas = true; }
        });

        if (!alreadyHas)
            auxFiles.push(gitFile);

    });

    console.log("=================================");
    console.log(nome);
    console.log(chave);
    console.log(periodo);
    console.log(tempo);

    if (auxFiles.length > 0) {

        console.log(`📦 Arquivos: ${totalQtdBkp} arquivos ` + '(' + '\x1b[32m', "+" + auxFiles.length + " arquivos", '\x1b[0m' + ') ');

        auxFiles.forEach(file => {
            var fileArray = file.split("(");
            fileArray[1] = fileArray[1].replace(")", "");
            console.log(`\t📬 ${fileArray[0]}` + '(' + '\x1b[32m', "" + fileArray[1] + "", '\x1b[0m' + ') ');
        });

        var fortune = await system.execShellCommandDontShowErrors('fortune /usr/share/games/fortunes/brasil');
        fortune = fortune.replace('\n', '').replace('\t', '');

        if (!fortune.includes("not found")) {
            console.log("");
            console.log(`\t 🧙 ${fortune}`);
            console.log("");
        }

    } else {
        console.log(arquivos);
    }

    if (pointsDiff > 0) {
        console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[32m' + "+" + pointsDiff + 'pts\x1b[0m' + ') ' + char[0]);
    } else if (pointsDiff < 0) {
        console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[31m' + "" + pointsDiff + 'pts\x1b[0m' + ') ' + char[0]);
    } else {
        console.log(pontuacao);
    }

    console.log("=================================");

}
