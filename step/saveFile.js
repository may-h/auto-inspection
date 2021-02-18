const chalk = require('chalk');
const inquirer = require('inquirer');
const approot = require('app-root-path').path;
const moment = require('moment');

module.exports = async (processObj) => {
  console.log(chalk.blue(`[Step ${processObj.step+1}. Saving Inspection File ]`));
    try {
        let { filename } = await inquirer.prompt([
            {
              type: 'input',
              message: chalk.blue(` Input File Name : `),
              name: 'filename',
              default : `inspection-${processObj.type}-${moment().format("YYYYMMDD")}`
            },
          ]);

          await processObj.workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
          // console.log('saved.')
    } catch(err) {
        console.log(chalk.red(`\n ERROR :  ${err}\n`));
        process.exit(1);
    }
}