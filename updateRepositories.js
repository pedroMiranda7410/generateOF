const user = require('./user.json');
const passwords = require('./passwords.json');
const system = require('./modules/system.js');

// VERIFICAR VARIÁVEIS GLOBAIS
var directory = user.directory;
var yourKey = user.yourKey;
var yourPassword = passwords.sisbb;

var result = [];

async function gitPullAllRepositories() {

  var cmd = `cd ${directory} && ls`;
  var getGitStatus = `git status`;

  var allProjects = await system.execShellCommand(cmd);

  allProjects = allProjects.split("\n");

  console.log();
  console.log(`📦 ${allProjects.length} projetos detectados em ${directory}`);

  for (var i = 0; i < allProjects.length; i++) {

    var projectName = allProjects[i];

    if (projectName != null && projectName != "") {

      var generateGitStatus = `cd ${directory}/${projectName} && ${getGitStatus}`;
      var gitStatus = await system.execShellCommand(generateGitStatus);

      var obj = {
        projectName: projectName,
        status: gitStatus,
        char: '🚫'
      };

      if (gitStatus.includes("nothing to commit") > 0) {

        var getGitURL = `git config --get remote.origin.url`;
        var generateGitURL = `cd ${directory}/${projectName} && ${getGitURL}`;
        var gitURL = await system.execShellCommand(generateGitURL);
        obj.URL = gitURL;

        var arrayURL = gitURL.split("//");
        var strURL = `${arrayURL[0]}//${yourKey}:${yourPassword}@${arrayURL[1]}`;

        var getGitPull = `git pull ${strURL}`;
        var generateGitPull = `cd ${directory}/${projectName} && ${getGitPull}`;
        var gitPull = await system.execShellCommand(generateGitPull);

        if (gitPull.includes("Already")) { obj.char = '✅'; }
        else if (gitPull.includes("denied")) { i = 9999; }
        else { obj.char = '📥'; }

      }

      result.push(obj);

      if (obj.char != "🚫") {
        console.log('\t' + obj.char + " " + obj.projectName);
      } else {
        console.log('\t' + obj.char + " " + obj.projectName);
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