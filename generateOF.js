const user = require('./user.json');
const negotials = require('./modules/negotials.js');
const pointsList = require('./modules/pointsList.json');
const fileManager = require('./modules/fileManager.js');
const termgraph = require('./modules/termgraph.js');
const system = require('./modules/system.js');
const utils = require('./modules/utils.js');
const fs = require('fs');
const readline = require('readline');
var Excel = require('exceljs');

// VERIFICAR VARIÁVEIS GLOBAIS
var directory = user.directory;
var directoryOF = user.directoryOF;
var yourName = user.yourName;
var yourKey = user.yourKey;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
let baseXLS = user.baseXLS;
let hermesXLS = user.hermesXLS;
let repeatFiles = user.repeatFiles;

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
var createCSSOptions = pointsList.points[14].options;
var alterCSSOptions = pointsList.points[15].options;
var createShellOptions = pointsList.points[18].options;
var alterShellOptions = pointsList.points[19].options;
var createSQLOptions = pointsList.points[20].options;

var createJavaTXT = pointsList.points[0].name;
var alterJavaTXT = pointsList.points[1].name;
var alterJavaCompTXT = pointsList.points[2].name;
var createJavaTestTXT = pointsList.points[3].name;
var createHTMLTXT = pointsList.points[4].name;
var alterHTMLTXT = pointsList.points[5].name;
var createJSTXT = pointsList.points[6].name;
var alterJSTXT = pointsList.points[7].name;
var createXMLTXT = pointsList.points[8].name;
var alterXMLTXT = pointsList.points[9].name;
var othersTXT = pointsList.points[10].name;
var createCSSTXT = pointsList.points[14].name;
var alterCSSTXT = pointsList.points[15].name;
var createShellTXT = pointsList.points[18].name;
var alterShellTXT = pointsList.points[19].name;
var createSQLTXT = pointsList.points[20].name;

var createJavaFinal = "";
var alterJavaFinal = "";
var alterJavaCompFinal = "";
var createJavaTestFinal = "";
var createHTMLFinal = "";
var alterHTMLFinal = "";
var createJSFinal = "";
var alterJSFinal = "";
var createXMLFinal = "";
var alterXMLFinal = "";
var createCSSFinal = "";
var alterCSSFinal = "";
var createShellFinal = "";
var alterShellFinal = "";
var createSQLFinal = "";
var othersFinal = "";

var createJavaFinalQTD = 0;
var alterJavaFinalQTD = 0;
var alterJavaCompFinalQTD = 0;
var createJavaTestFinalQTD = 0;
var createHTMLFinalQTD = 0;
var alterHTMLFinalQTD = 0;
var createJSFinalQTD = 0;
var alterJSFinalQTD = 0;
var createXMLFinalQTD = 0;
var alterXMLFinalQTD = 0;
var createCSSFinalQTD = 0;
var alterCSSFinalQTD = 0;
var createShellFinalQTD = 0;
var alterShellFinalQTD = 0;
var createSQLFinalQTD = 0;
var othersFinalQTD = 0;

var totalQtdBkp = 0;
var totalSISBBBkp = 0;
var gitFiles = [];

var data = new Date();
var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()].toUpperCase();
var year = data.getFullYear();

var fullReportFile = "";

async function processLineByLine() {

  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(baseXLS);
  let worksheet = workbook.getWorksheet("Orçamento");
  fileManager.cleanSpreedsheet(worksheet);
  workbook.xlsx.writeFile(baseXLS);

  let rowCounter = 4;

  var cmd = `cd ${directory} && ls`;
  var getGitCommits = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'> ${directoryOF}/input.txt`;

  var allProjects = await system.execShellCommand(cmd);
  allProjects = allProjects.split("\n");

  await system.execShellCommand(`mkdir -p ${month}-${year}`);
  directoryOF = `${directoryOF}/${month}-${year}`;

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitCommits = `cd ${directory}/${projectName} && ${getGitCommits}`;
      var getFullReportGit = `cd ${directory}/${projectName} && git log --no-merges --graph --stat --author=${yourKey} --after=${choosenDate} --pretty=format:'%as - #%h - %s %cn'`;

      await system.execShellCommand(generateGitCommits);

      var fullReportProject = await system.execShellCommand(getFullReportGit);

      const fileStream = fs.createReadStream('input.txt');

      var output = `${projectName}-${month}-${data.getFullYear()}`;
      projectName += "/";

      var filePath = `${directoryOF}/${output}.txt`;

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

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      var hashCommit = "###########";

      for await (var line of rl) {

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

      tmpFile = projectName + " - " + user.yourName + " - " + user.yourKey + " - " + user.choosenDate + " - " + user.otherDate + "\n\n";

      var tmpResult = fileManager.writeToFiles(createJavaQTD, createJavaPoints, createJavaOptions, tmpFile, createJava, createJavaTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterJavaQTD, alterJavaPoints, alterJavaOptions, tmpFile, alterJava, alterJavaTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterJavaCompQTD, alterJavaCompPoints, alterJavaCompOptions, tmpFile, alterJavaComp, alterJavaCompTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createJavaTestQTD, createJavaTestPoints, createJavaTestOptions, tmpFile, createJavaTest, createJavaTestTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createHTMLQTD, createHTMLPoints, createHTMLOptions, tmpFile, createHTML, createHTMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterHTMLQTD, alterHTMLPoints, alterHTMLOptions, tmpFile, alterHTML, alterHTMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createJSQTD, createJSPoints, createJSOptions, tmpFile, createJS, createJSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterJSQTD, alterJSPoints, alterJSOptions, tmpFile, alterJS, alterJSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createXMLQTD, createXMLPoints, createXMLOptions, tmpFile, createXML, createXMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterXMLQTD, alterXMLPoints, alterXMLOptions, tmpFile, alterXML, alterXMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createCSSQTD, createCSSPoints, createCSSOptions, tmpFile, createCSS, createCSSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterCSSQTD, alterCSSPoints, alterCSSOptions, tmpFile, alterCSS, alterCSSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createShellQTD, createShellPoints, createShellOptions, tmpFile, createShell, createShellTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(alterShellQTD, alterShellPoints, alterShellOptions, tmpFile, alterShell, alterShellTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = fileManager.writeToFiles(createSQLQTD, createSQLPoints, createShellOptions, tmpFile, createSQL, createSQLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;

      if (othersQTD > 0)
        tmpFile += `${othersTXT}\n ${others}\n`;

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

      totalQtdBkp += totalQtd;
      totalSISBBBkp += totalSISBB;

      tmpFile += `Total Geral: ${totalQtd} arquivos\n`;
      tmpFile += `Pontuação Geral: ${totalSISBB} SISBB\n\n`;

      if (totalQtd > 0) {

        fs.writeFile(filePath, tmpFile, function (err) {
          if (err) { return console.log(err); }
        });

        var projectTitle = `${projectName} `;

        while (projectTitle.length < 110) {
          projectTitle += "*";
        }

        fullReportFile += `${projectTitle} \n`;
        fullReportFile += `\n${fullReportProject}\n`;

      }

      createJavaFinal += createJava;
      alterJavaFinal += alterJava;
      alterJavaCompFinal += alterJavaComp;
      createJavaTestFinal += createJavaTest;
      createHTMLFinal += createHTML;
      alterHTMLFinal += alterHTML;
      createJSFinal += createJS;
      alterJSFinal += alterJS;
      createXMLFinal += createXML;
      alterXMLFinal += alterXML;
      createCSSFinal += createCSS;
      alterCSSFinal += alterCSS;
      createShellFinal += createShell;
      alterShellFinal += alterShell;
      createSQLFinal += createSQL;
      othersFinal += others;

      createJavaFinalQTD += createJavaQTD;
      alterJavaFinalQTD += alterJavaQTD;
      alterJavaCompFinalQTD += alterJavaCompQTD;
      createJavaTestFinalQTD += createJavaTestQTD;
      createHTMLFinalQTD += createHTMLQTD;
      alterHTMLFinalQTD += alterHTMLQTD;
      createJSFinalQTD += createJSQTD;
      alterJSFinalQTD += alterJSQTD;
      createXMLFinalQTD += createXMLQTD;
      alterXMLFinalQTD += alterXMLQTD;
      createCSSFinalQTD += createCSSQTD;
      alterCSSFinalQTD += alterCSSQTD;
      createShellFinalQTD += createShellQTD;
      alterShellFinalQTD += alterShellQTD;
      createSQLFinalQTD += createSQLQTD;
      othersFinalQTD += othersQTD;

      await system.execShellCommand('find . -name "input.txt" -type f -delete');

    }

  }

  var output = `${yourName}-${month}-${data.getFullYear()}`;
  var filePath = `${directoryOF}/${output}.txt`;

  fs.writeFile(filePath, fullReportFile, function (err) {
    if (err) { return console.log(err); }
  });

  var tmpResult = fileManager.writeToXLS(createJavaFinalQTD, createJavaOptions, createJavaFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterJavaFinalQTD, alterJavaOptions, alterJavaFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterJavaCompFinalQTD, alterJavaCompOptions, alterJavaCompFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createJavaTestFinalQTD, createJavaTestOptions, createJavaTestFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createHTMLFinalQTD, createHTMLOptions, createHTMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterHTMLFinalQTD, alterHTMLOptions, alterHTMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createJSFinalQTD, createJSOptions, createJSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterJSFinalQTD, alterJSOptions, alterJSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createXMLFinalQTD, createXMLOptions, createXMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterXMLFinalQTD, alterXMLOptions, alterXMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createCSSFinalQTD, createCSSOptions, createCSSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterCSSFinalQTD, alterCSSOptions, alterCSSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createShellFinalQTD, createShellOptions, createShellFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(alterShellFinalQTD, alterShellOptions, alterShellFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = fileManager.writeToXLS(createSQLFinalQTD, createSQLOptions, createSQLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;

  var addRitoPointsJson = negotials.addRitosPoints(totalSISBBBkp, rowCounter, worksheet);

  totalSISBBBkp = addRitoPointsJson.SISBBPoints;
  rowCounter = addRitoPointsJson.rowCounter;
  worksheet = addRitoPointsJson.worksheet;

  workbook.xlsx.writeFile(`${directoryOF}/${hermesXLS}`);

  await updateCalDatFile();

}

async function updateCalDatFile() {

  await system.execShellCommand('echo > cal.dat');

  var arrTermOptions = [
    { name: createJavaTXT, qtd: createJavaFinalQTD * createJavaPoints },
    { name: alterJavaTXT, qtd: alterJavaFinalQTD * alterJavaPoints },
    { name: alterJavaCompTXT, qtd: alterJavaCompFinalQTD * alterJavaCompPoints },
    { name: createJavaTestTXT, qtd: createJavaTestFinalQTD * createJavaTestPoints },
    { name: createHTMLTXT, qtd: createHTMLFinalQTD * createHTMLPoints },
    { name: alterHTMLTXT, qtd: alterHTMLFinalQTD * alterHTMLPoints },
    { name: createJSTXT, qtd: createJSFinalQTD * createJSPoints },
    { name: alterJSTXT, qtd: alterJSFinalQTD * alterJSPoints },
    { name: createXMLTXT, qtd: createXMLFinalQTD * createXMLPoints },
    { name: alterXMLTXT, qtd: alterXMLFinalQTD * alterXMLPoints },
    { name: createCSSTXT, qtd: createCSSFinalQTD * createCSSPoints },
    { name: alterCSSTXT, qtd: alterCSSFinalQTD * alterCSSPoints },
    { name: createShellTXT, qtd: createShellFinalQTD * createShellPoints },
    { name: alterShellTXT, qtd: alterShellFinalQTD * alterShellPoints },
    { name: createSQLTXT, qtd: createSQLFinalQTD * createSQLPoints }
  ];

  var ritosPoints = (pointsList.points[11].value +
    pointsList.points[12].value +
    pointsList.points[13].value) * utils.checkValidArrayLength(user.tasks);

  var operationPoints = pointsList.points[16].value * utils.checkValidArrayLength(user.operations);
  var repositoryPoints = pointsList.points[17].value * utils.checkValidArrayLength(user.repositories);

  arrTermOptions.push({
    name: "PARTICIPAÇÕES_EM_RITOS", qtd: ritosPoints
  });

  arrTermOptions.push({
    name: "CRIAÇÃO_DE_OPERAÇÃO", qtd: operationPoints
  });

  arrTermOptions.push({
    name: "CRIAÇÃO_DE_REPOSITÓRIO", qtd: repositoryPoints
  });

  var calDatFile = termgraph.generateCalDatFile(arrTermOptions);

  var filePath = `${user.directoryOF}/cal.dat`;

  fs.writeFile(filePath, calDatFile, function (err) {
    if (err) { return console.log(err); }
  });

  console.log("");
  console.log(await system.execShellCommand('echo -n 📊​ $(tput bold)RELATÓRIO DE OF$(tput sgr0)'));
  console.log("");

  if (othersFinalQTD > 0) {
    console.log(await system.execShellCommand(`echo -n 📦 $(tput bold)Arquivos detectados:$(tput sgr0) ${totalQtdBkp} + '\x1b[33m'${othersFinalQTD}'\x1b[0m' arquivos`));
  } else {
    console.log(await system.execShellCommand(`echo -n 📦 $(tput bold)Arquivos detectados:$(tput sgr0) ${totalQtdBkp} arquivos`));
  }

  gitFiles.forEach(file => {
    var fileArray = file.split("(");
    fileArray[1] = fileArray[1].replace(")", "");
    console.log(`\t📬 ${fileArray[0]}` + '(' + '\x1b[32m', "" + fileArray[1] + "", '\x1b[0m' + ') ');
  });

  if (othersFinalQTD > 0) {
    var arr = othersFinal.split("\n");
    arr.forEach(file => {
      if (file != "")
        console.log(`\t📬` + '\x1b[33m' + ` ${file}` + '\x1b[0m');
    });
  }

  console.log(await system.execShellCommand('termgraph cal.dat'));


  console.log(await system.execShellCommand(`echo -n 🎯 $(tput bold)Pontuação:$(tput sgr0) ${totalSISBBBkp}pts`));
  console.log("");

  await system.execShellCommand('find . -name "cal.dat" -type f -delete');

}

processLineByLine();
