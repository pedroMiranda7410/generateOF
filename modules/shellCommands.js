const user = require('../user.json');

var directory = user.directory;
var directoryOF = user.directoryOF;
var yourKey = user.yourKey;
var choosenDate = user.choosenDate;
var otherDate = user.otherDate;

module.exports.cdAndLs = `cd ${directory} && ls`;
module.exports.getGitCommits = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'`;
module.exports.generateGitCommits = (projectName) => { return `cd ${directory}/${projectName} && ${this.getGitCommits}`; }

module.exports.getGitCommitsOutput = `git log --name-status --no-merges --author=${yourKey} --after=${choosenDate} --before=${otherDate} --pretty=format:'commit: #%h'> ${directoryOF}/input.txt`;
module.exports.generateGitCommitsOutput = (projectName) => { return `cd ${directory}/${projectName} && ${this.getGitCommitsOutput}`; }

module.exports.getFullReportGit = (projectName) => { return `cd ${directory}/${projectName} && git log --no-merges --graph --stat --author=${yourKey} --after=${choosenDate} --pretty=format:'%as - #%h - %s %cn'`; }


