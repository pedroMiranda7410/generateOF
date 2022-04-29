const user = require('./user.json');
const pointsList = require('./pointsList.json');
const utils = require('./utilScripts.js');
const fs = require('fs');

const args = utils.getArgs();
//console.log(args);

// VERIFICAR VARIÁVEIS GLOBAIS
var directory = user.directory;
var directoryOF = user.directoryOF;
var yourName = user.yourName;
var yourKey = user.yourKey;
var yourPassword = user.yourPassword;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
var histories = user.histories;
var operations = user.operations;
var repositories = user.repositories;
let baseXLS = user.baseXLS;
let points = user.points;

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

var SISBBPoints = 0;
var gitFiles = [];

var createJavaOptions = pointsList.points[0].options;
var alterJavaOptions = pointsList.points[1].options;
var alterJavaCompOptions = pointsList.points[2].options;
var createJavaTestOptions = pointsList.points[3].options;
var createHTMLOptions = pointsList.points[4].options;
var alterHTMLOptions = pointsList.points[5].options;
var createJSOptions = pointsList.points[6].options;
var alterJSOptions = pointsList.points[7].options;
var createXMLOptions = pointsList.points[8].options;
var alterXMLOptions = pointsList.points[9].options;
var createCSSOptions = pointsList.points[10].options;
var alterCSSOptions = pointsList.points[11].options;

function writeToFiles(QTD, points, options, tmpFile, files, rowCounter) {

  if (QTD > 0)
    rowCounter++;

  return { 'tmpFile': tmpFile, 'rowCounter': rowCounter };

}

function execShellCommand(cmd) {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error)
        console.warn(error);
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function processLineByLine() {

  let rowCounter = 4;

  var cmd = `cd ${directory} && ls`;
  var getGitCommits = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'`;

  var allProjects = await execShellCommand(cmd);
  allProjects = allProjects.split("\n");

  var totalQtdBkp = 0;

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitCommits = `cd ${directory}/${projectName} && ${getGitCommits}`;
      var commits = await execShellCommand(generateGitCommits);
      commits = commits.split("\n");
      projectName += "/";

      var linesFromInput = [];
      var tmpFile = "";

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
      var othersQTD = 0;

      var hashCommit = "###########";
      var verifyWithoutNodeModules = true;

      for (var o = 0; o < commits.length; o++) {

        var line = commits[o];
        verifyWithoutNodeModules = !line.includes('node_modules');

        if (line.includes("commit:") && verifyWithoutNodeModules)
          hashCommit = line.split("#")[1];

        if (!linesFromInput.includes(line) && verifyWithoutNodeModules) {

          if (!line.includes("commit:") && line != "") {

            linesFromInput.push(line);

            var n = line.lastIndexOf("src");
            var a = line.lastIndexOf("pom");
            var b = line.lastIndexOf("values");

            if (n > 0) { line = line.substring(0, n) + projectName + line.substring(n); }
            else if (a > 0) { line = line.substring(0, a) + projectName + line.substring(a); }
            else if (b > 0) { line = line.substring(0, b) + projectName + line.substring(b); }

            var type = line.charAt(0);

            if (line.lastIndexOf(".") > 0) {

              var extension = line.split(".")[1].split("#")[0];

              if (type == "M" && extension == "js") {
                alterJS += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + alterJSPoints + "pts)");
                alterJSQTD++;
              } else if (type == "A" && extension == "js") {
                createJS += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + createJSPoints + "pts)");
                createJSQTD++;
              } else if (type == "M" && (extension == "css" || extension == "scss")) {
                alterCSS += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + alterCSSPoints + "pts)");
                alterCSSQTD++;
              } else if (type == "A" && (extension == "css" || extension == "scss")) {
                createCSS += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + createCSSPoints + "pts)");
                createCSSQTD++;
              } else if (type == "M" && extension == "java") {
                if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
                  createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
                  gitFiles.push(line + " (+" + createJavaTestPoints + "pts)");
                  createJavaTestQTD++;
                } else {
                  alterJava += `${line.substring(1)}#${hashCommit}\n`;
                  gitFiles.push(line + " (+" + alterJavaPoints + "pts)");
                  alterJavaQTD++;
                }
              } else if (type == "A" && extension == "java") {
                if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
                  createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
                  createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
                  createJavaTestQTD++;
                } else {
                  createJava += `${line.substring(1)}#${hashCommit}\n`;
                  gitFiles.push(line + " (+" + createJavaPoints + "pts)");
                  createJavaQTD++;
                }
              } else if (type == "D" && extension == "java") {
                alterJavaComp += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + alterJavaCompPoints + "pts)");
                alterJavaCompQTD++;
              } else if (type == "M" && (extension == "html" || extension == "xhtml")) {
                alterHTML += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + alterHTMLPoints + "pts)");
                alterHTMLQTD++;
              } else if (type == "A" && (extension == "html" || extension == "xhtml")) {
                createHTML += `${line.substring(1)}#${hashCommit}\n`;
                gitFiles.push(line + " (+" + createHTMLPoints + "pts)");
                createHTMLQTD++;
              } else if (type == "M" && (extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties")) {

                if (extension == "minimal") {
                  if (line.split(".")[2].split("#")[0] == "yaml") {
                    alterXML += `${line.substring(1)}#${hashCommit}\n`;
                    gitFiles.push(line + " (+" + alterXMLPoints + "pts)");
                    alterXMLQTD++;
                  }
                } else {
                  alterXML += `${line.substring(1)}#${hashCommit}\n`;
                  gitFiles.push(line + " (+" + alterXMLPoints + "pts)");
                  alterXMLQTD++;
                }

              } else if (type == "A" && extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties") {

                if (extension == "minimal") {
                  if (line.split(".")[2].split("#")[0] == "yaml") {
                    createXML += `${line.substring(1)}#${hashCommit}\n`;
                    gitFiles.push(line + " (+" + createXMLPoints + "pts)");
                    createXMLQTD++;
                  }
                } else {
                  createXML += `${line.substring(1)}#${hashCommit}\n`;
                  gitFiles.push(line + " (+" + createXMLPoints + "pts)");
                  createXMLQTD++;
                }

              } else {
                othersQTD++;
              }

            } else {
              othersQTD++;
            }

          }

        }

      }

      var tmpResult = writeToFiles(createJavaQTD, createJavaPoints, createJavaOptions, tmpFile, createJava, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJavaQTD, alterJavaPoints, alterJavaOptions, tmpFile, alterJava, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJavaCompQTD, alterJavaCompPoints, alterJavaCompOptions, tmpFile, alterJavaComp, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createJavaTestQTD, createJavaTestPoints, createJavaTestOptions, tmpFile, createJavaTest, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createHTMLQTD, createHTMLPoints, createHTMLOptions, tmpFile, createHTML, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterHTMLQTD, alterHTMLPoints, alterHTMLOptions, tmpFile, alterHTML, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createJSQTD, createJSPoints, createJSOptions, tmpFile, createJS, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJSQTD, alterJSPoints, alterJSOptions, tmpFile, alterJS, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createXMLQTD, createXMLPoints, createXMLOptions, tmpFile, createXML, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterXMLQTD, alterXMLPoints, alterXMLOptions, tmpFile, alterXML, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createCSSQTD, createCSSPoints, createCSSOptions, tmpFile, createCSS, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterCSSQTD, alterCSSPoints, alterCSSOptions, tmpFile, alterCSS, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;

      var totalQtd = createJavaQTD + alterJavaQTD + alterJavaCompQTD + createJavaTestQTD
        + createHTMLQTD + alterHTMLQTD + createJSQTD + alterJSQTD + createXMLQTD
        + createCSSQTD + alterCSSQTD + alterXMLQTD + othersQTD;

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
        + (alterXMLQTD * alterXMLPoints);

      tmpFile += `Total Geral: ${totalQtd} arquivos\n`;
      tmpFile += `Pontuação Geral: ${totalSISBB}pts\n\n`;
      totalQtdBkp += totalQtd;
      SISBBPoints += totalSISBB;

    }

  }

  if (operations && operations.length > 0 && operations.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[16].value * operations.length);

  if (repositories && repositories.length > 0 && repositories.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[17].value * repositories.length);

  if (histories && histories.length > 0 && histories.every(function (i) { return i != "\n"; })) {
    SISBBPoints += (pointsList.points[11].value * histories.length);
    SISBBPoints += (pointsList.points[12].value * histories.length);
    SISBBPoints += (pointsList.points[13].value * histories.length);
  }

  var nome = await execShellCommand(`echo -n 👤 Nome: ${yourName}`);
  var chave = await execShellCommand(`echo -n 🔑 Chave: ${yourKey}`);
  var periodo = await execShellCommand(`echo -n 📆 Período: ${choosenDate} à ${otherDate}`);

  var date1 = new Date();
  var date2 = new Date(otherDate);

  const diffTime = date2 - date1;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  var tempo = "";

  if (diffDays > 0) {
    tempo = await execShellCommand(`echo -n ⏳ Tempo restante: ${diffDays} dias`);
  } else {
    tempo = await execShellCommand(`echo -n ⌛ Tempo restante: 🚫`);
  }

  var arquivos = await execShellCommand(`echo -n 📦 Arquivos: ${totalQtdBkp} arquivos`);
  var char = returnSISBBStatus(diffDays);
  var pontuacao = await execShellCommand(`echo -n 🎯 Pontuação: ${SISBBPoints}pts ${char}`);

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
    console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[32m', "+" + pointsDiff + "pts", '\x1b[0m' + ') ' + char);
  } else if (pointsDiff < 0) {
    console.log(pontuacaoArr[0] + 'pts ' + '(' + '\x1b[31m', "" + pointsDiff + "pts", '\x1b[0m' + ') ' + char);
  } else {
    console.log(pontuacao);
  }

  console.log("=================================");

  //var reportMessage = `"${SISBBPoints} SISBB"`;
  //await execShellCommand(`notify-send -i face-cool -t 1000 -u low "Pontuação Atual" ${reportMessage}`);

  await updateUserJsonFile(SISBBPoints, gitFiles);

}

function returnSISBBStatus(diffDays) {

  var extremelyHappyChars = [`🚀`];
  var veryHappyChars = [`🥳`, `😎`, `😝`, `🤪`, `🥰`, `😍`, `🤩`];
  var happyChars = [`😁`, `😀`, `😊`, `😇`, `🙂`];
  var neutralChars = [`🥲`, `😶`, `😐`, `😅`];
  var almostChars = [`🥺`, `😕`, `😟`];
  var fewSadChars = [`😣`, `😫`, `😩`];
  var sadChars = [`😨`, `😰`, `😓`];
  var verySadChars = [`😭`, `😱`];
  var deadChars = [`💀`];

  var char = "";

  if (SISBBPoints > 599) {
    char = extremelyHappyChars[Math.floor(Math.random() * extremelyHappyChars.length)];
  } else if (SISBBPoints > 389) {
    char = veryHappyChars[Math.floor(Math.random() * veryHappyChars.length)];
  } else if (SISBBPoints > 299) {
    char = happyChars[Math.floor(Math.random() * happyChars.length)];
  } else if (SISBBPoints > 284) {

    if (diffDays > 1) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else {
      char = neutralChars[Math.floor(Math.random() * neutralChars.length)];
    }

  } else if (SISBBPoints > 280) {

    if (diffDays > 15) {
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

  } else if (SISBBPoints > 200) {

    if (diffDays > 20) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 15) {
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

  } else if (SISBBPoints > 150) {

    if (diffDays > 25) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 20) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 15) {
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

  } else if (SISBBPoints > 95) {

    if (diffDays > 30) {
      char = happyChars[Math.floor(Math.random() * happyChars.length)];
    } else if (diffDays > 25) {
      char = almostChars[Math.floor(Math.random() * almostChars.length)];
    } else if (diffDays > 15) {
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

  } else {

    if (diffDays > 25) {
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

  return char;

}

async function updateUserJsonFile(points, files) {

  var filePath = `${directoryOF}/user.json`;

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
  }

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
  }

  var histStr = "";

  if (histories) {
    var histArray = histories.toString().split(",");

    histStr += "[";
    histArray.forEach(history => {
      history = history.replace("\n", "");
      histStr += `"${history}\\n",`;
    });
    histStr = histStr.slice(0, -1);
    histStr += "]";
  }

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
  }

  var userJsonFile = `{
    "directory": "${directory}",
    "directoryOF": "${directoryOF}",
    "yourName": "${yourName}",
    "yourKey": "${yourKey}",
    "yourPassword": "${yourPassword}",
    "choosenDate": "${choosenDate}",
    "otherDate": "${otherDate}",
    "operations": ${opStr},
    "repositories": ${repoStr},
    "histories": ${histStr},
    "baseXLS": "${baseXLS}",
    "points": "${points}",
    "files": ${filesStr}
}`;

  await execShellCommand('find . -name "user.json" -type f -delete');

  fs.writeFile(filePath, userJsonFile, function (err) {
    if (err) { return console.log(err); }
  });

}

function a() {

  const https = require('https')
  const options = {
    hostname: 'example.com',
    port: 443,
    path: '/todos',
    method: 'GET'
  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.end()

}

processLineByLine();
