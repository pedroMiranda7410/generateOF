const user = require('../user.json');
const pointsList = require('../modules/pointsList.json');
const fileManager = require('../modules/fileManager.js');

var tasks = user.tasks;
var operations = user.operations;
var repositories = user.repositories;

var ritoOptions1 = pointsList.points[11].options;
var ritoOptions2 = pointsList.points[12].options;
var ritoOptions3 = pointsList.points[13].options;

var operationOptions = pointsList.points[16].options;
var repositoryOptions = pointsList.points[17].options;
var ritosList = [ritoOptions1, ritoOptions2, ritoOptions3];
var operationList = [operationOptions];
var repositoryList = [repositoryOptions];

module.exports.checkValidLineFromCommit = (line) => {

  if (!line.includes('node_modules')
    && !line.includes('www')
    && !line.includes('target')
    && !line.includes('.env')
    && !line.includes('.csv')
    && !line.includes('.gitignore')
    && !line.includes('mvnw')
    && !line.includes('jacoco')
    && !line.includes('coverage')
    && !line.includes('wrapper')
    && !line.includes('.classpath')
    && !line.includes('.project')
    && !line.includes('.settings')
    && !line.includes('.dockerignore')
    && !line.includes('.bbdev')
    && !line.includes('.idea')
    && !line.includes('WebContent')
    && !line.includes('.md')
    && !line.includes('package-lock')
    && !line.includes('.vscode')
    && !line.includes('.editorconfig')
    && !line.includes('.DS_Store')
  ) {
    return true;
  }

  return false;

}

module.exports.detectFilesCategory = (line, projectName, gitFiles, linesFromInput, hashCommit,
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
) => {

  linesFromInput.push(line);

  var n = line.lastIndexOf("src");
  var a = line.lastIndexOf("pom");
  var b = line.lastIndexOf("values");

  if (n > 0) { line = line.substring(0, n) + projectName + line.substring(n); }
  else if (a > 0) { line = line.substring(0, a) + projectName + line.substring(a); }
  else if (b > 0) { line = line.substring(0, b) + projectName + line.substring(b); }

  var type = line.charAt(0);

  if ((line.lastIndexOf(".") > 0 && type != "R") || line.includes("Dockerfile") || line.includes("Jenkinsfile")) {

    var arr = line.split(".");
    var extension = arr[arr.length - 1];

    if (type == "M" && (extension == "js" || extension == "ts")) {
      if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
        createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
        createJavaTestQTD++;
      } else {
        alterJS += `${line.substring(1)}#${hashCommit}\n`;
        gitFiles.push(line + " (+" + alterJSPoints + "pts)");
        alterJSQTD++;
      }
    } else if (type == "A" && (extension == "js" || extension == "ts")) {
      if (line.lastIndexOf('test') > 0 || line.lastIndexOf('Test') > 0) {
        createJavaTest += `${line.substring(1)}#${hashCommit}\n`;
        createJavaTestQTD++;
      } else {
        createJS += `${line.substring(1)}#${hashCommit}\n`;
        gitFiles.push(line + " (+" + createJSPoints + "pts)");
        createJSQTD++;
      }
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
    } else if (type == "M" && (extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties" || extension == "json" || line.includes('Dockerfile') || line.includes('Jenkinsfile'))) {

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

    } else if (type == "A" && (extension == "xml" || extension == "yaml" || extension == "minimal" || extension == "properties" || extension == "json" || line.includes('Dockerfile') || line.includes('Jenkinsfile'))) {

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

      // } else if (type == "A" && (extension == "sh")) {
      //   createShell += `${line.substring(1)}#${hashCommit}\n`;
      //   gitFiles.push(line + " (+" + createShellPoints + "pts)");
      //   createShellQTD++;
      // } else if (type == "M" && (extension == "sh")) {
      //   alterShell += `${line.substring(1)}#${hashCommit}\n`;
      //   gitFiles.push(line + " (+" + alterShellPoints + "pts)");
      //   alterShellQTD++;
      // } 

    } else if ((type == "M" || type == "A") && (extension == "sql")) {
      createSQL += `${line.substring(1)}#${hashCommit}\n`;
      gitFiles.push(line + " (+" + createSQLPoints + "pts)");
      createSQLQTD++;
    } else if ((type == "M" || type == "A") && (extension == "sql")) {
      createSQL += `${line.substring(1)}#${hashCommit}\n`;
      gitFiles.push(line + " (+" + createSQLPoints + "pts)");
      createSQLQTD++;
    } else {
      others += `${line}#${hashCommit}\n`;
      othersQTD++;
    }

  } else {
    others += `${line}#${hashCommit}\n`;
    othersQTD++;
  }

  var obj = {
    line: line,
    projectName: projectName,
    gitFiles: gitFiles,
    linesFromInput: linesFromInput,
    hashCommit: hashCommit,
    alterJS: alterJS,
    alterJSPoints: alterJSPoints,
    alterJSQTD: alterJSQTD,
    createJS: createJS,
    createJSPoints: createJSPoints,
    createJSQTD: createJSQTD,
    alterCSS: alterCSS,
    alterCSSPoints: alterCSSPoints,
    alterCSSQTD: alterCSSQTD,
    createCSS: createCSS,
    createCSSPoints: createCSSPoints,
    createCSSQTD: createCSSQTD,
    createJavaTest: createJavaTest,
    createJavaTestPoints: createJavaTestPoints,
    createJavaTestQTD: createJavaTestQTD,
    createJava: createJava,
    createJavaPoints: createJavaPoints,
    createJavaQTD: createJavaQTD,
    alterJava: alterJava,
    alterJavaPoints: alterJavaPoints,
    alterJavaQTD: alterJavaQTD,
    alterJavaComp: alterJavaComp,
    alterJavaCompPoints: alterJavaCompPoints,
    alterJavaCompQTD: alterJavaCompQTD,
    alterHTML: alterHTML,
    alterHTMLPoints: alterHTMLPoints,
    alterHTMLQTD: alterHTMLQTD,
    createHTML: createHTML,
    createHTMLPoints: createHTMLPoints,
    createHTMLQTD: createHTMLQTD,
    alterXML: alterXML,
    alterXMLPoints: alterXMLPoints,
    alterXMLQTD: alterXMLQTD,
    createXML: createXML,
    createXMLPoints: createXMLPoints,
    createXMLQTD: createXMLQTD,
    createShell: createShell,
    createShellPoints: createShellPoints,
    createShellQTD: createShellQTD,
    alterShell: alterShell,
    alterShellPoints: alterShellPoints,
    alterShellQTD: alterShellQTD,
    createSQL: createSQL,
    createSQLPoints: createSQLPoints,
    createSQLQTD: createSQLQTD,
    others: others,
    othersQTD: othersQTD
  }

  return obj;

}

module.exports.addRitosPoints = (SISBBPoints, rowCounter, worksheet) => {

  if (operations && operations.length > 0 && operations.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[16].value * operations.length);

  if (repositories && repositories.length > 0 && repositories.every(function (i) { return i != "\n"; }))
    SISBBPoints += (pointsList.points[17].value * repositories.length);

  if (tasks && tasks.length > 0 && tasks.every(function (i) { return i != "\n"; })) {
    SISBBPoints += (pointsList.points[11].value * tasks.length);
    SISBBPoints += (pointsList.points[12].value * tasks.length);
    SISBBPoints += (pointsList.points[13].value * tasks.length);
  }

  if (rowCounter != null) {

    if (operations && operations.length > 0 && operations.every(function (i) { return i != "\n"; }))
      rowCounter = fileManager.addHistoryRito(operations, operationList, worksheet, rowCounter);

    if (repositories && repositories.length > 0 && repositories.every(function (i) { return i != "\n"; }))
      rowCounter = fileManager.addHistoryRito(repositories, repositoryList, worksheet, rowCounter);

    if (tasks && tasks.length > 0 && tasks.every(function (i) { return i != "\n"; }))
      rowCounter = fileManager.addHistoryRito(tasks, ritosList, worksheet, rowCounter);

  }

  var jsonReturn = {
    "SISBBPoints": SISBBPoints,
    "rowCounter": rowCounter,
    "worksheet": worksheet
  };

  return jsonReturn;

}
