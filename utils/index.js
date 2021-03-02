const shell = require("shelljs");
const chalk = require("chalk");
const inquirer = require("inquirer");
const moment = require("moment");

module.exports = {
  shellExec: async (command) => {
    const response = await shell.exec(command);
    if (response.code !== 0)
      return `[ERROR] Occure, Please check manually : ${response.stderr}`;
    return response.stdout;
  },
  shellCd: async (path) => {
    console.log(path);
    const response = await shell.cd(path);
    if (response.code !== 0) {
      return false;
    }
    console.log(response.stderr);
    return true;
  },
  getFilename: async () => {
    try {
      let { filename } = await inquirer.prompt([
        {
          type: "input",
          message: chalk.blue(` Input File Name : `),
          name: "filename",
          default: `inspection-${moment().format("YYYYMMDDhhmmss")}`,
        },
      ]);
      return `${filename}-${moment().format("YYYYMMDDhhmmss")}`;
    } catch (err) {
      console.log("ERROR -> ", error);
    }
  },
};
