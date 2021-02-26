const approot = require('app-root-path');
const util = require(`${approot.path}/utils`)

module.exports = async (type, outputFormat) => {
  try {
    const inspection_list = require(`${approot.path}/config/commands/${type}`);
    const outputRun  = require(`${__dirname}/${outputFormat}`);
    const inspection_result = {}

    // 점검 명령어 실행 로직
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


  // let processObj = {
  //   config,              // config.
  //   workbook,            // xlxs workbook. 
  //   worksheet,           // xlxs worksheet. 
  //   type,                // 점검 종류 (search, chatbot, recommendation).
  //   format : "",         // 저장 형태(json, xlxs);
  //   proceed: true, 			 // step을 앞으로 진행할지 여부(true면 순차 진행).
  //   step: 0, 						 // 진행할 step. 
  // };

  // while (processObj.step > -1) {
  //   // console.log('inside while :', processObj.step+1)
  //   // 실행시킬 step.
  //   let stepProcess = stepList[processObj.step];
  //   // step 실행.
  //   await stepProcess(processObj);

  //   // proceed 후처리.
  //   if (processObj.proceed) processObj.step++;
  //   else processObj.step--;

  //   // step 관리.
  //   if (processObj.step < 0) return true;
  //   else if (processObj.step > stepList.length - 1) break;

  //   // proceed 처리 후, 기본값으로 복원.
  //   processObj.proceed = true;
  // }

  // console.log('All Process Is Done. Let Me Save File');
  // // await saveFile(workbook);
  // console.log('done');

};
