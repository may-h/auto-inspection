const approot = require('app-root-path');
const util = require(`${approot.path}/utils`)

module.exports = async (type, outputFormat) => {
  try {
    const inspection_list = require(`${approot.path}/config/commands/${type}`);
    const outputRun  = require(`${__dirname}/${outputFormat}`);
    const inspection_result = {}

    // 점검 명령어 실행 로직 (공통).
    //["CPU", "SERVICE_STATUS", "DISK_STATUS", "LOGS"]
    for (category of Object.keys(inspection_list)) {
      const commands = inspection_list[category];
      inspection_result[category] = []
      for (command of commands) {
          if(command.path) {
              let result = await util.shellCd(command.path);
              if(!result) {
                  command.response = `no directory : ${command.path}`;
              }
          };
          command.response = command.response || (await util.shellExec(command.command,  {silent:true}));
          inspection_result[category].push(command);
      }
    };

    //선택한 output Format으로 출력
    await outputRun(inspection_result)

  } catch (err) {
    console.log("ERROR -> ", err.message );
  }
};
