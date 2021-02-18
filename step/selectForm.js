const chalk = require('chalk');
const inquirer = require('inquirer');
const config = require("../config/header/config.json");


module.exports = async (processObj) => {
    try {
        let { format } = await inquirer.prompt([
            {
              type: 'list',
              message: chalk.blue(`[Step ${processObj.step+1}. Select a result file format ]  `),
              name: 'format',
              choices: ["json", "xlxs", "console"]
            },
          ]);
        
          if(!format) processObj.proceed = false;
          processObj.format = format;

    } catch(err) {
        console.log(chalk.red(`\n ERROR :  ${err}\n`));
        process.exit(1);
    }
}