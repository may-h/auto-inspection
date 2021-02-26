const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const approot = require('app-root-path');
const package = require(`${approot}/package.json`);
const run = require('../src/index');

const checkProcessExit = (str) => {
  str = str.replace(/[^A-Za-z]/gi, '');
  if (str.toLowerCase() === 'end' || str.toLowerCase() === 'exit' || str.toLowerCase() === 'e') {
    console.log(chalk.green('\n  [Process] Process Exit\n'));
    process.exit(0);
    // 'back' 키워드도 동시에 체크
  } else if (str.toLowerCase() === 'back' || str.toLowerCase() === 'b') {
    return true;
  }
  return false;
}

program.description(package.description).version(package.version, '-v, --version').usage('[option]');

// Commands
program.option('-s, --start').action(async () => {
  let proceed = true;

  while (proceed) {
    proceed = false;

    // Select Inspection Type 
    let { type } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select the type of inspection',
        name: 'type',
        choices: [
          'search',
          'chatbot',
          'recommendation',
          '[Exit]'
        ],
      },
    ]);

    if (type === '[Exit]') checkProcessExit('exit');

    // Select Output Type 
    let { outputFormat } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select the format type of result',
        name: 'outputFormat',
        choices: [
          'json', 
          'xlsx', 
          'console', 
          '[Exit]'
        ],
      },
    ]);
    
    if (outputFormat === '[Exit]') checkProcessExit('exit');


    console.log('your type : ', type, ' your format : ', outputFormat);

    run(type,outputFormat);
    

  }
});

program.parse(program.argv);
