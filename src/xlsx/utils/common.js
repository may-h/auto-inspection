const inquirer = require("inquirer");
const chalk = require("chalk");

module.exports = {
  ynChoice: async (message) => { // Y,N 선택 질문. 
    const { answer } = await inquirer.prompt([
      {
        type: "confirm",
        message: chalk.blue(`${message}`),
        name: "answer",
      },
    ]);
    return answer;
  },
  getInquireList: async(input_list) => {
    let result = {};
    for (key of input_list) {
      const { input } = await inquirer.prompt([
        {
          type: "input",
          message: `${key} :`,
          name: "input",
        },
      ]);
      result[key] = input;
    }
    return result;
  }
};
