const chalk = require("chalk");

module.exports = async (inspection_result) => {

    console.log(chalk.blue.bold(`[CONSOLE] Print Inspection Output `));
    
    //터미널 콘솔 출력. 
    for (category of Object.keys(inspection_result)) {
        const commands = inspection_result[category];
        console.log(chalk.blue(`[${category}]`));
        for (command of commands) {
            console.log(chalk.yellow(`├ 항목 : ${command.name}`));
            console.log(chalk.yellow(`├ 명령어 : ${command.command}`));
            console.log(chalk.yellow(`└ 출력내용 : ${command.response}\n`));
        }
      };
};