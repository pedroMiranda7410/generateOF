const user = require('./user.json');
const pointsList = require('./pointsList.json');
const fs = require('fs');
const { Console } = require('console');

// VERIFICAR VARIÁVEIS GLOBAIS
var directory = user.directory;
var directoryOF = user.directoryOF;
var yourName = user.yourName;
var yourKey = user.yourKey;
var yourPassword = user.yourPassword;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;
var histories = user.histories;
let baseXLS = user.baseXLS;
let points = user.points;

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

var result = [];

async function gitPullAllRepositories() {

  var cmd = `cd ${directory} && ls`;
  var getGitStatus = `git status`;

  var allProjects = await execShellCommand(cmd);

  allProjects = allProjects.split("\n");

  console.log();
  console.log(`📦 ${allProjects.length} projetos detectados em ${directory}`);

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitStatus = `cd ${directory}/${projectName} && ${getGitStatus}`;
      var gitStatus = await execShellCommand(generateGitStatus);

      var obj = {
        projectName: projectName,
        status: gitStatus,
        char: '🚫'
      };

      if (gitStatus.includes("nothing to commit") > 0) {

        var getGitURL = `git config --get remote.origin.url`;
        var generateGitURL = `cd ${directory}/${projectName} && ${getGitURL}`;
        var gitURL = await execShellCommand(generateGitURL);
        obj.URL = gitURL;

        var arrayURL = gitURL.split("//");
        var strURL = `${arrayURL[0]}//${yourKey}:${yourPassword}@${arrayURL[1]}`;

        var getGitPull = `git pull ${strURL}`;
        var generateGitPull = `cd ${directory}/${projectName} && ${getGitPull}`;
        var gitPull = await execShellCommand(generateGitPull);

        if (gitPull.includes("Already up to date.") > 0) { obj.char = '✅'; }
        else { obj.char = '📥'; }

      }

      result.push(obj);

      if (obj.char != "🚫") {
        console.log('\t' + obj.char + " " + obj.projectName);
      } else {
        console.log('\t' + obj.char + " " + obj.projectName + "\n" + obj.status);
      }

    }

    //i = allProjects.length + 1;

  }

  console.log();

}

async function main() {
  await gitPullAllRepositories();
}

main();