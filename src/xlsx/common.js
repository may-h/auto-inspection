const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = {
  ynChoice: async (message) => {
    const { answer } = await inquirer.prompt([
      {
        type: "confirm",
        message: chalk.blue(`${message}`),
        name: "answer",
      },
    ]);
    return answer;
  },
};
