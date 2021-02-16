const chalk = require('chalk');
const inquirer = require('inquirer');
const config = require("../config/header/config.json");


module.exports = async (processObj) => {
    console.log(chalk.blue(`Step : ${processObj.step}, selected Type : ${processObj.type}`));
    try {
      Object.keys(config).map(v => {
        if(typeof v == 'object') {}
        console.log(chalk.green(`  [Header Config] ${v} : ${JSON.stringify(config[v])}`));
      });

        let { choice } = await inquirer.prompt([
            {
              type: 'confirm',
              message: chalk.blue(`[Step 1. Check Config : ${processObj.type}] : Above config is correct ? `),
              name: 'choice',
            },
          ]);
        
          if(!choice) processObj.proceed = false;

    } catch(err) {
        console.log(chalk.red(`\n ERROR :  ${err}\n`));
        process.exit(1);
    }
}