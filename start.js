const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const approot = require('app-root-path');
const package = require(`${approot}/package.json`);
const test = require('./index');

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

    // Your choice
    let { type } = await inquirer.prompt([
      {
        type: 'list',
        message: 'Pick the Type of Inspection',
        name: 'type',
        choices: [
          'Search Engine',
          'Chatbot Engine',
          'Recommendation Engine',
          '[Exit]'
        ],
      },
    ]);

    if (type === 'Search Engine') {
      console.log('your choice is ' + type);
      proceed = (await test(type)) || false;
    } else if (type === 'Chatbot Engine') {
      console.log('your choice is ' + type);
      proceed = (await test(type)) || false;
    } else if (type === 'Recommendation Engine') {
      console.log('your choice is ' + type);
      proceed = (await test(type)) || false;
    } else if (type === '[Exit]') {
      checkProcessExit('exit');
    }
  }
});

program.parse(program.argv);