const userConfig = require('../config/userConfig.json');
const user = require('../user.json');
const system = require('./system.js');
const utils = require('./utils.js');
const holiday = require('./holiday.js');

var yourName = userConfig.yourName;
var yourKey = userConfig.yourKey;
var yourCountry = userConfig.yourCountry;
var yourState = userConfig.yourState;
var yourCity = userConfig.yourCity;

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

    var diffDays = utils.getBusinessDatesCount(date1, date2);

    var choosenDateObj = new Date(choosenDate);
    var otherDateObj = new Date(otherDate);
    var holidays = holiday.getHolidayBetweenDates(choosenDateObj, otherDateObj, yourCountry, yourState, yourCity);
    var tempo = "";

    if (holidays.length > 0) {
        holidays.forEach(feriado => {
            if (!feriado.isPast) { diffDays--; }
        });
    }

    if (diffDays > 0) {
        tempo = await system.execShellCommand(`echo -n ⏳ Tempo restante: ${diffDays - holidays.length} dias`);
    } else {
        tempo = await system.execShellCommand(`echo -n ⌛ Tempo restante: 🚫`);
    }

    if (holidays.length > 0) {

        if (holidays.length < 10) {
            tempo += ` [\x1b[32m0${holidays.length} feriados 🏖️ ​\x1b[0m] `;
        } else {
            tempo += ` [\x1b[32m${holidays.length} feriados 🏖️ ​\x1b[0m] `;
        }

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

    if (holidays.length > 0) {
        holidays.forEach(feriado => {
            if (feriado.isPast) {
                console.log('\t' + '\x1b[9m', "" + `🏖️  ${feriado.dia} - (${utils.getDayByDate(feriado.m)} ${utils.formatDate2TerminalReport(feriado.d)})` + "", '\x1b[0m' + ' ');
            } else {
                console.log('\t' + '\x1b[0m', "" + `🏖️  ${feriado.dia} - (${utils.getDayByDate(feriado.m)} ${utils.formatDate2TerminalReport(feriado.d)})` + "", '\x1b[0m' + ' ');
            }
        });
    }

    if (auxFiles.length > 0) {

        console.log(`📦 Arquivos: ${totalQtdBkp} arquivos ` + '(' + '\x1b[32m', "+" + auxFiles.length + " arquivos", '\x1b[0m' + ') ');

        auxFiles.forEach(file => {
            var fileArray = file.split("(");
            fileArray[1] = fileArray[1].replace(")", "");
            console.log(`\t📬 ${fileArray[0]}` + '(' + '\x1b[32m', "" + fileArray[1] + "", '\x1b[0m' + ') ');
        });

        var fortune = await system.execShellCommandDontShowErrors('fortune /usr/share/games/fortunes/brasil');

        while (fortune.includes("\n") || fortune.includes("\t")) {
            fortune = fortune.replace('\n', '').replace('\t', '');
        }

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
