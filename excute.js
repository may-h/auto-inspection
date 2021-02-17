const shell = require("shelljs");

const exec = async (command) => {
  const response = await shell.exec(command);
  if (response.code !== 0)
    return `Error Occure, Please check manually : ${response.stderr}`;
  return response.stdout;
};

const cd = async(path) => {

  console.log(path)
  const response = await shell.cd(path);
  if (response.code !== 0 ) {
      return false;
  }

  console.log(response.stderr)
  return true;
}


module.exports = {exec, cd};
