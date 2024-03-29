const user = require('../user.json');
const userConfig = require('../config/userConfig.json');

var directory = userConfig.directory;
var directoryOF = userConfig.directoryOF;
var yourKey = userConfig.yourKey;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;

module.exports.cdAndLs = `cd ${directory} && ls`;
module.exports.getGitCommits = `git whatchanged -p -w --name-status --no-merges --perl-regexp --author='${yourKey.toLowerCase()}|${yourKey.toUpperCase()}' --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h' --shortstat --grep="[^\s]*" --all`;
module.exports.generateGitCommits = (projectName) => { return `cd ${directory}/${projectName} && ${this.getGitCommits}`; }

module.exports.getGitCommitsOutput = `git whatchanged -p -w --name-status --no-merges --perl-regexp --author='${yourKey.toLowerCase()}|${yourKey.toUpperCase()}' --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h' --grep="[^\s]*" --all> ${directoryOF}/input.txt`;
module.exports.generateGitCommitsOutput = (projectName) => { return `cd ${directory}/${projectName} && ${this.getGitCommitsOutput}`; }

module.exports.getFullReportGit = (projectName) => { return `cd ${directory}/${projectName} && git whatchanged -p -w --no-merges --graph --stat --perl-regexp --author='${yourKey.toLowerCase()}|${yourKey.toUpperCase()}' --after=${choosenDate} --pretty=format:'%as - #%h - %s %cn' --grep="[^\s]*" --all`; }
