const user = require('./user.json');
const negotials = require('./modules/negotials.js');
const pointsList = require('./modules/pointsList.json');
const system = require('./modules/system.js');
const fs = require('fs');

// VERIFICAR VARIÁVEIS GLOBAIS
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
let points = user.points;
let repeatFiles = user.repeatFiles;
let userHermes = user.userHermes;
let metaPoints = user.metaPoints;

let files = user.files;

var createJavaPoints = pointsList.points[0].value;
var alterJavaPoints = pointsList.points[1].value;
var alterJavaCompPoints = pointsList.points[2].value;
var createJavaTestPoints = pointsList.points[3].value;
var createHTMLPoints = pointsList.points[4].value;
var alterHTMLPoints = pointsList.points[5].value;
var createJSPoints = pointsList.points[6].value;
var alterJSPoints = pointsList.points[7].value;
var createXMLPoints = pointsList.points[8].value;
var alterXMLPoints = pointsList.points[9].value;
var createCSSPoints = pointsList.points[14].value;
var alterCSSPoints = pointsList.points[15].value;
var createShellPoints = pointsList.points[18].value;
var alterShellPoints = pointsList.points[19].value;
var createSQLPoints = pointsList.points[20].value;

var SISBBPoints = 0;
var gitFiles = [];

var othersFinalQTD = 0;

async function processLineByLine() {

  var cmd = `cd ${directory} && ls`;
  var getGitCommits = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'`;

  var allProjects = await system.execShellCommand(cmd);
  allProjects = allProjects.split("\n");

  var totalQtdBkp = 0;

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitCommits = `cd ${directory}/${projectName} && ${getGitCommits}`;
      var commits = await system.execShellCommand(generateGitCommits);
      commits = commits.split("\n");
      projectName += "/";

      var linesFromInput = [];

      var createJava = "";
      var alterJava = "";
      var alterJavaComp = "";
      var createJavaTest = "";
      var createHTML = "";
      var alterHTML = "";
      var createJS = "";
      var alterJS = "";
      var createCSS = "";
      var alterCSS = "";
      var createXML = "";
      var alterXML = "";
      var createShell = "";
      var alterShell = "";
      var createSQL = "";
      var others = "";

      var createJavaQTD = 0;
      var alterJavaQTD = 0;
      var alterJavaCompQTD = 0;
      var createJavaTestQTD = 0;
      var createHTMLQTD = 0;
      var alterHTMLQTD = 0;
      var createJSQTD = 0;
      var alterJSQTD = 0;
      var createCSSQTD = 0;
      var alterCSSQTD = 0;
      var createXMLQTD = 0;
      var alterXMLQTD = 0;
      var createShellQTD = 0;
      var alterShellQTD = 0;
      var createSQLQTD = 0;
      var othersQTD = 0;

      var hashCommit = "###########";

      for (var o = 0; o < commits.length; o++) {

        var line = commits[o];

        if (line.includes("commit:") && negotials.checkValidLineFromCommit(line))
          hashCommit = line.split("#")[1];

        var condition = true;

        if (repeatFiles == false || repeatFiles == "false")
          condition = !linesFromInput.includes(line)

        if (condition) {

          if (!line.includes("commit:") && line != "" && negotials.checkValidLineFromCommit(line)) {

            var obj = negotials.detectFilesCategory(line, projectName, gitFiles, linesFromInput, hashCommit,
              alterJS, alterJSPoints, alterJSQTD,
              createJS, createJSPoints, createJSQTD,
              alterCSS, alterCSSPoints, alterCSSQTD,
              createCSS, createCSSPoints, createCSSQTD,
              createJavaTest, createJavaTestPoints, createJavaTestQTD,
              createJava, createJavaPoints, createJavaQTD,
              alterJava, alterJavaPoints, alterJavaQTD,
              alterJavaComp, alterJavaCompPoints, alterJavaCompQTD,
              alterHTML, alterHTMLPoints, alterHTMLQTD,
              createHTML, createHTMLPoints, createHTMLQTD,
              alterXML, alterXMLPoints, alterXMLQTD,
              createXML, createXMLPoints, createXMLQTD,
              createShell, createShellPoints, createShellQTD,
              alterShell, alterShellPoints, alterShellQTD,
              createSQL, createSQLPoints, createSQLQTD,
              others, othersQTD
            );

            line = obj.line;
            projectName = obj.projectName;
            gitFiles = obj.gitFiles;
            linesFromInput = obj.linesFromInput;
            hashCommit = obj.hashCommit;
            alterJS = obj.alterJS;
            alterJSQTD = obj.alterJSQTD;
            createJS = obj.createJS;
            createJSQTD = obj.createJSQTD;
            alterCSS = obj.alterCSS;
            alterCSSQTD = obj.alterCSSQTD;
            createCSS = obj.createCSS;
            createCSSQTD = obj.createCSSQTD;
            createJavaTest = obj.createJavaTest;
            createJavaTestQTD = obj.createJavaTestQTD;
            createJava = obj.createJava;
            createJavaQTD = obj.createJavaQTD;
            alterJava = obj.alterJava;
            alterJavaQTD = obj.alterJavaQTD;
            alterJavaComp = obj.alterJavaComp;
            alterJavaCompQTD = obj.alterJavaCompQTD;
            alterHTML = obj.alterHTML;
            alterHTMLQTD = obj.alterHTMLQTD;
            createHTML = obj.createHTML;
            createHTMLQTD = obj.createHTMLQTD;
            alterXML = obj.alterXML;
            alterXMLQTD = obj.alterXMLQTD;
            createXML = obj.createXML;
            createXMLQTD = obj.createXMLQTD;
            alterShell = obj.alterShell;
            alterShellQTD = obj.alterShellQTD;
            createShell = obj.createShell;
            createShellQTD = obj.createShellQTD;
            createSQL = obj.createSQL;
            createSQLQTD = obj.createSQLQTD;
            others = obj.others;
            othersQTD = obj.othersQTD;

          }

        }

      }

      var totalQtd = createJavaQTD + alterJavaQTD + alterJavaCompQTD + createJavaTestQTD
        + createHTMLQTD + alterHTMLQTD + createJSQTD + alterJSQTD + createXMLQTD
        + createCSSQTD + alterCSSQTD + alterXMLQTD + createShellQTD + alterShellQTD + createSQLQTD;

      var totalSISBB = (createJavaQTD * createJavaPoints)
        + (alterJavaQTD * alterJavaPoints)
        + (alterJavaCompQTD * alterJavaCompPoints)
        + (createJavaTestQTD * createJavaTestPoints)
        + (createHTMLQTD * createHTMLPoints)
        + (alterHTMLQTD * alterHTMLPoints)
        + (createJSQTD * createJSPoints)
        + (alterJSQTD * alterJSPoints)
        + (createCSSQTD * createCSSPoints)
        + (alterCSSQTD * alterCSSPoints)
        + (alterXMLQTD * alterXMLPoints)
        + (createShellQTD * createShellPoints)
        + (alterShellQTD * alterShellPoints)
        + (createSQLQTD * createSQLPoints);

      othersFinalQTD += othersQTD;
      totalQtdBkp += totalQtd;
      SISBBPoints += totalSISBB;

    }

  }

  if (operations && operations.length > 0 && operations.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[16].value * operations.length);

  if (repositories && repositories.length > 0 && repositories.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[17].value * repositories.length);

  if (tasks && tasks.length > 0 && tasks.every(function (i) { return i != "\n"; })) {
    SISBBPoints += (pointsList.points[11].value * tasks.length);
    SISBBPoints += (pointsList.points[12].value * tasks.length);
    SISBBPoints += (pointsList.points[13].value * tasks.length);
  }

  var nome = await system.execShellCommand(`echo -n 👤 Nome: ${yourName}`);
  var chave = await system.execShellCommand(`echo -n 🔑 Chave: ${yourKey}`);
  var periodo = await system.execShellCommand(`echo -n 📆 Período: ${choosenDate} à ${otherDate}`);

  var date1 = new Date();
  var date2 = new Date(otherDate);

  const diffDays = negotials.getBusinessDatesCount(date1, date2);

  var tempo = "";

  if (diffDays > 0) {
    tempo = await system.execShellCommand(`echo -n ⏳ Tempo restante: ${diffDays} dias`);
  } else {
    tempo = await system.execShellCommand(`echo -n ⌛ Tempo restante: 🚫`);
  }

  var arquivos = await system.execShellCommand(`echo -n 📦 Arquivos: ${totalQtdBkp} arquivos`);

  if (othersFinalQTD > 0)
    arquivos = await system.execShellCommand(`echo -n 📦 Arquivos: ${totalQtdBkp} + '\x1b[33m'${othersFinalQTD}'\x1b[0m' arquivos`);

  var char = returnSISBBStatus(diffDays);
  var pontuacao = await system.execShellCommand(`echo -n 🎯 Pontuação: ${SISBBPoints}pts ${char[0]} ${char[1]}`);

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

    console.log("");

  } else {
    console.log(arquivos);
  }

  if (pointsDiff > 0) {
    console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[32m', "+" + pointsDiff + 'pts \x1b[0m' + ') ' + char);
  } else if (pointsDiff < 0) {
    console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[31m', "" + pointsDiff + 'pts \x1b[0m' + ') ' + char);
  } else {
    console.log(pontuacao);
  }

  console.log("=================================");

  await updateUserJsonFile(SISBBPoints, gitFiles);

}

function returnSISBBStatus(diffDays) {

  var percent = (SISBBPoints / metaPoints) * 100;

  //var championChars = [`🎉​`, `🎊`, `​🎖️`, `​🏆`, `​🏅`, `​🥇`, `​⛳`];
  var championChars = [`✅​`];
  var superChars = [`🦸​`]
  var extremelyHappyChars = [`🚀`];
  var veryHappyChars = [`🥳`, `😎`, `😝`, `🤪`, `🥰`, `😍`, `🤩`];
  var happyChars = [`😁`, `😀`, `😊`, `😇`, `🙂`];
  var neutralChars = [`🥲`, `😶`, `😐`, `😅`];
  var almostChars = [`🥺`, `😕`, `😟`];
  var fewSadChars = [`😣`, `😫`, `😩`];
  var sadChars = [`😨`, `😰`, `😓`];
  var verySadChars = [`😭`, `😱`];
  var deadChars = [`💀`];  

  var arrChars = [];

  if (percent >= 350) {
    char = superChars[Math.floor(Math.random() * superChars.length)];
  } else if (percent >= 210) {
    char = extremelyHappyChars[Math.floor(Math.random() * extremelyHappyChars.length)];
  } else if (percent >= 136) {
    char = veryHappyChars[Math.floor(Math.random() * veryHappyChars.length)];
  } else if (percent >= 104) {
    char = happyChars[Math.floor(Math.random() * happyChars.length)];
  } else if (percent >= 99) {

    if (diffDays > 1) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else {
      char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
    }

  } else if (percent >= 98) {

    if (diffDays > 10) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 5) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 1) {
      char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
    } else if (diffDays == 1) {
      char = sadChars[Math.floor(Math.random() * sadChars.length)];
    } else {
      char = deadChars[Math.floor(Math.random() * deadChars.length)];
    }

  } else if (percent >= 70) {

    if (diffDays > 10) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 5) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 1) {
      char = sadChars[Math.floor(Math.random() * sadChars.length)];
    } else if (diffDays == 1) {
      char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
    } else {
      char = deadChars[Math.floor(Math.random() * deadChars.length)];
    }

  } else if (percent >= 50) {

    if (diffDays > 20) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 15) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 10) {
      char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
    } else if (diffDays > 5) {
      char = sadChars[Math.floor(Math.random() * sadChars.length)];
    } else if (diffDays > 1) {
      char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
    } else if (diffDays == 1) {
      char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
    } else {
      char = deadChars[Math.floor(Math.random() * deadChars.length)];
    }

  } else if (percent >= 33) {

    if (diffDays > 15) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 10) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 5) {
      char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
    } else if (diffDays > 1) {
      char = sadChars[Math.floor(Math.random() * sadChars.length)];
    } else if (diffDays == 1) {
      char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
    } else {
      char = deadChars[Math.floor(Math.random() * deadChars.length)];
    }

  } else {

    if (diffDays > 20) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 5) {
      char = fewSadChars[Math.floor(Math.random() * fewSadChars.length)];
    } else if (diffDays > 1) {
      char = sadChars[Math.floor(Math.random() * sadChars.length)];
    } else if (diffDays == 1) {
      char = verySadChars[Math.floor(Math.random() * verySadChars.length)];
    } else {
      char = deadChars[Math.floor(Math.random() * deadChars.length)];
    }

  }

  arrChars.push(char);

  var diffToTarget = SISBBPoints - metaPoints;

  var date1 = new Date(choosenDate);
  var date2 = new Date(otherDate);

  var totalDiffDays = negotials.getBusinessDatesCount(date1, date2);

  if (diffToTarget >= 0) {
    arrChars.push(championChars[Math.floor(Math.random() * championChars.length)]);
  } else {
    arrChars.push("\x1b[31m[" + Math.abs(diffToTarget) + "pts] \x1b[0m");
  }

  var expected = Math.round((metaPoints / totalDiffDays) * diffDays);

  if (SISBBPoints < expected) {
    arrChars.push("\x1b[33m[" + Math.abs(expected) + "pts] \x1b[0m");
  }

  return arrChars;

}

async function updateUserJsonFile(points, files) {

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

processLineByLine();
