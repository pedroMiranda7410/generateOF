const errorMessages = require('./errorMessages.js');

module.exports.execShellCommand = (cmd) => {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error)
        console.warn(error);
      resolve(stdout ? stdout : stderr);
    });
  });
}

module.exports.execShellCommandCheckFolders = (cmd) => {
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        if (cmd.split('&&').length > 0) {
          var res = cmd.split('&&')[0].split(" ")[1];
          console.log(errorMessages.notAGitRepository(res));
        } else { console.warn(error) }
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
