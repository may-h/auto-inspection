const shell = require("shelljs");

const exec = async (command) => {
  const response = await shell.exec(command);
  if (response.code !== 0)
    return `Error Occure, Please check manually : ${response.stderr}`;
  return response.stdout;
};

const cd = async(path) => {
  await shell.cd(path);
}


module.exports = {exec, cd};
