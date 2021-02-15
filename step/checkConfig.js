const chalk = require('chalk');
const inquirer = require('inquirer');


module.exports = async (processObj) => {
    console.log(`Step : ${processObj.step}, selected Type : ${processObj.type}`);

    try {
        let { choice } = await inquirer.prompt([
            {
              type: 'confirm',
              message: `[Step 1. Connection Test] Pick the Domain ID in config list :`,
              name: 'choice',
            //   choices: ['YES', 'NO'],
            },
          ]);
        
          if(!choice) processObj.proceed = false;

    } catch(err) {
        console.log(chalk.red(`\n ERROR :  ${err}\n`));
    }
}