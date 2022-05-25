const user = require('./user.json');
const passwords = require('./passwords.json');
const pointsList = require('./pointsList.json');
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
var histories = user.histories;
var operations = user.operations;
var repositories = user.repositories;
let baseXLS = user.baseXLS;
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

var ritoOptions1 = pointsList.points[11].options;
var ritoOptions2 = pointsList.points[12].options;
var ritoOptions3 = pointsList.points[13].options;

var operationOptions1 = pointsList.points[16].options;

var repositoryOptions = pointsList.points[17].options;

var ritosList = [ritoOptions1, ritoOptions2, ritoOptions3];
var operationList = [operationOptions1];
var repositoryList = [repositoryOptions];

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
var othersFinalQTD = 0;

var data = new Date();
var month = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"][data.getMonth()].toUpperCase();
var year = data.getFullYear();

var fullReportFile = "";

function writeToFiles(QTD, points, options, tmpFile, files, filesTXT, worksheet, rowCounter) {

  if (QTD > 0) {

    tmpFile += `${filesTXT}\n ${files}\n`;
    tmpFile += `    Total: ${QTD} arquivos\n`;
    tmpFile += `    Pontuação: ${QTD * points} SISBB\n\n`;

  }

  return { 'tmpFile': tmpFile, 'rowCounter': rowCounter };

}

function writeToXLS(QTD, options, files, worksheet, rowCounter) {

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

function cleanSpreedsheat(worksheet) {

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

function addHistoryRito(histories, ritosList, worksheet, rowCounter) {

  var historiesStr = "";

  histories.forEach(history => {
    historiesStr += history;
  });

  ritosList.forEach(rito => {

    let row = worksheet.getRow(rowCounter);
    row.getCell(3).value = rito[0];
    row.getCell(4).value = rito[1];
    row.getCell(5).value = rito[2];
    row.getCell(7).value = rito[3];
    row.getCell(8).value = rito[4];
    row.getCell(11).value = histories.length;
    row.getCell(12).value = historiesStr;
    row.commit();
    rowCounter++;

  });

  return rowCounter;

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

  let workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(baseXLS);
  let worksheet = workbook.getWorksheet("Orçamento");
  cleanSpreedsheat(worksheet);
  workbook.xlsx.writeFile('SimuladorBase.xlsx');

  let rowCounter = 4;

  var cmd = `cd ${directory} && ls`;
  var getGitCommits = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'> ${directoryOF}/input.txt`;

  var allProjects = await execShellCommand(cmd);
  allProjects = allProjects.split("\n");

  await execShellCommand(`mkdir -p ${month}-${year}`);
  directoryOF = `${directoryOF}/${month}-${year}`;

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitCommits = `cd ${directory}/${projectName} && ${getGitCommits}`;
      var getFullReportGit = `cd ${directory}/${projectName} && git log --no-merges --graph --stat --author=${yourKey} --after=${choosenDate} --pretty=format:'%as - #%h - %s %cn'`;

      await execShellCommand(generateGitCommits);

      var fullReportProject = await execShellCommand(getFullReportGit);

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
      var createXML = "";
      var alterXML = "";
      var createCSS = "";
      var alterCSS = "";
      var others = "";

      var createJavaQTD = 0;
      var alterJavaQTD = 0;
      var alterJavaCompQTD = 0;
      var createJavaTestQTD = 0;
      var createHTMLQTD = 0;
      var alterHTMLQTD = 0;
      var createJSQTD = 0;
      var alterJSQTD = 0;
      var createXMLQTD = 0;
      var alterXMLQTD = 0;
      var createCSSQTD = 0;
      var verifyWithoutNodeModules = true;
      var verifyWithoutWWW = true;
      var verifyWithoutTarget = true;
      var verifyWithoutEnv = true;
      var verifyWithoutGitIgnore = true;
      var verifyWithoutDockerfile = true;
      var verifyWithoutMvnw = true;
      var verifyWithoutJenkinsfile = true;
      var verifyWithoutJacoco = true;
      var verifyWithoutGruntfile = true;
      var verifyWithoutCoverage = true;
      var verifyWithoutSpec = true;
      var verifyWithoutWrapper = true;
      var verifyWithoutClasspath = true;
      var verifyWithoutdockerignore = true;
      var verifyWithoutbbdev = true;
      var verifyWithoutideia = true;
      var verifyWithoutWebContent = true;
      var verifyWithoutMd = true;
      var verifyWithoutpackage_lock = true;
      var alterCSSQTD = 0;
      var othersQTD = 0;

      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      
      var hashCommit = "###########";

      for await (var line of rl) {
        verifyWithoutNodeModules = !line.includes('node_modules');
        verifyWithoutWWW = !line.includes('www');
        verifyWithoutTarget = !line.includes('target');
        verifyWithoutEnv = !line.includes('.env');
        verifyWithoutGitIgnore = !line.includes('.gitignore');
        verifyWithoutDockerfile = !line.includes('Dockerfile');
        verifyWithoutMvnw = !line.includes('mvnw');
        verifyWithoutJenkinsfile = !line.includes('Jenkinsfile');
        verifyWithoutJacoco = !line.includes('jacoco');
        verifyWithoutCoverage = !line.includes('coverage');
        verifyWithoutWrapper = !line.includes('wrapper');
        verifyWithoutClasspath = !line.includes('.classpath');
        verifyWithoutdockerignore = !line.includes('.dockerignore');
        verifyWithoutbbdev = !line.includes('.bbdev');
        verifyWithoutideia = !line.includes('.idea');
        verifyWithoutWebContent = !line.includes('WebContent');
        verifyWithoutMd = !line.includes('.md');
        verifyWithoutpackage_lock = !line.includes('package-lock');
        

        if (line.includes("commit:") && verifyWithoutNodeModules 
        && verifyWithoutWWW && verifyWithoutTarget && verifyWithoutEnv 
        && verifyWithoutGitIgnore && verifyWithoutMvnw && verifyWithoutDockerfile 
        && verifyWithoutJenkinsfile && verifyWithoutJacoco && verifyWithoutGruntfile 
        && verifyWithoutCoverage && verifyWithoutSpec && verifyWithoutWrapper && verifyWithoutClasspath
        && verifyWithoutdockerignore && verifyWithoutbbdev && verifyWithoutideia && verifyWithoutWebContent && verifyWithoutMd && verifyWithoutpackage_lock)
          hashCommit = line.split("#")[1];

        var condition = true;

        if (repeatFiles == false || repeatFiles == "false")
          condition = !linesFromInput.includes(line)

        if (condition) {

          if (!line.includes("commit:") && line != "" && verifyWithoutNodeModules 
          && verifyWithoutWWW && verifyWithoutTarget && verifyWithoutEnv 
          && verifyWithoutGitIgnore && verifyWithoutMvnw && verifyWithoutDockerfile
          && verifyWithoutJenkinsfile && verifyWithoutJacoco 
          && verifyWithoutGruntfile && verifyWithoutCoverage  && verifyWithoutSpec && verifyWithoutWrapper && verifyWithoutClasspath
          && verifyWithoutdockerignore && verifyWithoutbbdev && verifyWithoutideia && verifyWithoutWebContent && verifyWithoutMd && verifyWithoutpackage_lock)  {

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
                alterJSQTD++;
              } else if (type == "A" && extension == "js") {
                createJS += `${line.substring(1)}#${hashCommit}\n`;
                createJSQTD++;
              } else if (type == "M" && (extension == "css" || extension == "scss")) {
                alterCSS += `${line.substring(1)}#${hashCommit}\n`;
                alterCSSQTD++;
              } else if (type == "A" && (extension == "css" || extension == "scss")) {
                createCSS += `${line.substring(1)}#${hashCommit}\n`;
                createCSSQTD++;
              } else if (type == "M" && extension == "java") {
                if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
                  createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
                  createJavaTestQTD++;
                } else {
                  alterJava += `${line.substring(1)}#${hashCommit}\n`;
                  alterJavaQTD++;
                }
              } else if (type == "A" && extension == "java") {
                if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
                  createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
                  createJavaTestQTD++;
                } else {
                  createJava += `${line.substring(1)}#${hashCommit}\n`;
                  createJavaQTD++;
                }
              } else if (type == "D" && extension == "java") {
                alterJavaComp += `${line.substring(1)}#${hashCommit}\n`;
                alterJavaCompQTD++;
              } else if (type == "M" && (extension == "html" || extension == "xhtml")) {
                alterHTML += `${line.substring(1)}#${hashCommit}\n`;
                alterHTMLQTD++;
              } else if (type == "A" && (extension == "html" || extension == "xhtml")) {
                createHTML += `${line.substring(1)}#${hashCommit}\n`;
                createHTMLQTD++;
              } else if (type == "M" && (extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties" || extension == "json")) {

                if (extension == "minimal") {
                  if (line.split(".")[2].split("#")[0] == "yaml") {
                    alterXML += `${line.substring(1)}#${hashCommit}\n`;
                    alterXMLQTD++;
                  }
                } else {
                  alterXML += `${line.substring(1)}#${hashCommit}\n`;
                  alterXMLQTD++;
                }

              } else if (type == "A" && extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties" || extension == "json") {

                if (extension == "minimal") {
                  if (line.split(".")[2].split("#")[0] == "yaml") {
                    createXML += `${line.substring(1)}#${hashCommit}\n`;
                    createXMLQTD++;
                  }
                } else {
                  createXML += `${line.substring(1)}#${hashCommit}\n`;
                  createXMLQTD++;
                }

              } else {
                others += `${line}#${hashCommit}\n`;
                othersQTD++;
              }

            } else {
              others += `${line}#${hashCommit}\n`;
              othersQTD++;
            }

          }

        }

      }

      tmpFile = projectName + " - " + user.yourName + " - " + user.yourKey + " - " + user.choosenDate + " - " + user.otherDate + "\n\n";

      var tmpResult = writeToFiles(createJavaQTD, createJavaPoints, createJavaOptions, tmpFile, createJava, createJavaTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJavaQTD, alterJavaPoints, alterJavaOptions, tmpFile, alterJava, alterJavaTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJavaCompQTD, alterJavaCompPoints, alterJavaCompOptions, tmpFile, alterJavaComp, alterJavaCompTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createJavaTestQTD, createJavaTestPoints, createJavaTestOptions, tmpFile, createJavaTest, createJavaTestTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createHTMLQTD, createHTMLPoints, createHTMLOptions, tmpFile, createHTML, createHTMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterHTMLQTD, alterHTMLPoints, alterHTMLOptions, tmpFile, alterHTML, alterHTMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createJSQTD, createJSPoints, createJSOptions, tmpFile, createJS, createJSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterJSQTD, alterJSPoints, alterJSOptions, tmpFile, alterJS, alterJSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createXMLQTD, createXMLPoints, createXMLOptions, tmpFile, createXML, createXMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterXMLQTD, alterXMLPoints, alterXMLOptions, tmpFile, alterXML, alterXMLTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(createCSSQTD, createCSSPoints, createCSSOptions, tmpFile, createCSS, createCSSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;
      tmpResult = writeToFiles(alterCSSQTD, alterCSSPoints, alterCSSOptions, tmpFile, alterCSS, alterCSSTXT, worksheet, rowCounter);
      tmpFile = tmpResult.tmpFile; rowCounter = tmpResult.rowCounter;

      if (othersQTD > 0)
        tmpFile += `${othersTXT}\n ${others}\n`;

      var totalQtd = createJavaQTD + alterJavaQTD + alterJavaCompQTD + createJavaTestQTD
        + createHTMLQTD + alterHTMLQTD + createJSQTD + alterJSQTD + createXMLQTD
        + createCSSQTD + alterCSSQTD + alterXMLQTD;

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
      othersFinalQTD += othersQTD;

      await execShellCommand('find . -name "input.txt" -type f -delete');

    }

  }

  var output = `${yourName}-${month}-${data.getFullYear()}`;
  var filePath = `${directoryOF}/${output}.txt`;

  fs.writeFile(filePath, fullReportFile, function (err) {
    if (err) { return console.log(err); }
  });

  var tmpResult = writeToXLS(createJavaFinalQTD, createJavaOptions, createJavaFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterJavaFinalQTD, alterJavaOptions, alterJavaFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterJavaCompFinalQTD, alterJavaCompOptions, alterJavaCompFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(createJavaTestFinalQTD, createJavaTestOptions, createJavaTestFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(createHTMLFinalQTD, createHTMLOptions, createHTMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterHTMLFinalQTD, alterHTMLOptions, alterHTMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(createJSFinalQTD, createJSOptions, createJSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterJSFinalQTD, alterJSOptions, alterJSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(createXMLFinalQTD, createXMLOptions, createXMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterXMLFinalQTD, alterXMLOptions, alterXMLFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(createCSSFinalQTD, createCSSOptions, createCSSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;
  tmpResult = writeToXLS(alterCSSFinalQTD, alterCSSOptions, alterCSSFinal, worksheet, rowCounter);
  rowCounter = tmpResult.rowCounter;

  if (operations && operations.length > 0 && operations.every(function (i) { return i != "\n"; }))
    rowCounter = addHistoryRito(operations, operationList, worksheet, rowCounter);

  if (repositories && repositories.length > 0 && repositories.every(function (i) { return i != "\n"; }))
    rowCounter = addHistoryRito(repositories, repositoryList, worksheet, rowCounter);

  if (histories && histories.length > 0 && histories.every(function (i) { return i != "\n"; }))
    rowCounter = addHistoryRito(histories, ritosList, worksheet, rowCounter);

  workbook.xlsx.writeFile(`${directoryOF}/SimuladorBase2.xlsx`);

}

processLineByLine();
