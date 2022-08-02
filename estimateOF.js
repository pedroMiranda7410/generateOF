async function processLineByLine() {

  const checkPersonalFiles = require('./config/checkPersonalFiles.js');
  var checkPersonalFilesResult = await checkPersonalFiles.checkPersonalFiles();
  console.log(checkPersonalFilesResult);

  if (checkPersonalFilesResult) {

    const updateGit = require('./config/updateGit.js');
    updateGit.updateGitRepository();

    await checkPersonalFiles.checkBashFunctions();
    await checkPersonalFiles.checkNodeModules();

    const userConfig = require('./config/userConfig.json');
    const negotials = require('./modules/negotials.js');
    const pointsList = require('./modules/pointsList.json');
    const system = require('./modules/system.js');
    const fileManager = require('./modules/fileManager.js');
    const shellCommands = require('./modules/shellCommands.js');
    const terminalReport = require('./modules/terminalReport.js');

    let repeatFiles = userConfig.repeatFiles;

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

    var allProjects = await system.execShellCommand(shellCommands.cdAndLs);
    allProjects = allProjects.split("\n");

    var totalQtdBkp = 0;

    for (var i = 0; i < allProjects.length; i++) {

      var projectName = allProjects[i];

      if (projectName != null && projectName != "") {

        var commits = await system.execShellCommandCheckFolders(shellCommands.generateGitCommits(projectName));
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

    SISBBPoints = negotials.addRitosPoints(SISBBPoints, null, "").SISBBPoints;

    await terminalReport.printEstimateTerminalReport(totalQtdBkp, othersFinalQTD, SISBBPoints, gitFiles);
    await fileManager.updateUserJsonFile(SISBBPoints, gitFiles);

  } else {
    console.log("🚨​ Módulo userConfig.json não foi encontrado 🚨​​");
  }

}

processLineByLine();
