const checkConfig = require('./step/checkConfig');
const generateHeader = require('./step/generateHeader');
const inspection = require('./step/inspection');
const generateFooter = require('./step/generateFooter');
const saveFile = require('./step/saveFile');
const Excel = require("exceljs");
const config = require("./config/footer/config.json");


const stepList = [
    checkConfig, 
    generateHeader, 
    inspection, 
    generateFooter,
    saveFile
  ];

const createWorkbook = async (type) => {
  return new Excel.Workbook();
}

// const saveFile = async (workbook) => {
//   await workbook.xlsx.writeFile("test.xlsx");
//   console.log('saved.')
// }


module.exports = async (type) => {
  let workbook = await createWorkbook(type); 
  let worksheet = await workbook.addWorksheet(`Inspection-${type}`);

  let processObj = {
    config,
    workbook, 
    worksheet,
    type,
    proceed: true, 				// step을 앞으로 진행할지 여부(true면 순차 진행).
    step: 0, 							// 진행할 step.
  };

  while (processObj.step > -1) {
    // console.log('inside while :', processObj.step+1)
    // 실행시킬 step.
    let stepProcess = stepList[processObj.step];
    // step 실행.
    await stepProcess(processObj);

    // proceed 후처리.
    if (processObj.proceed) processObj.step++;
    else processObj.step--;

    // step 관리.
    if (processObj.step < 0) return true;
    else if (processObj.step > stepList.length - 1) break;

    // proceed 처리 후, 기본값으로 복원.
    processObj.proceed = true;
  }

  console.log('All Process Is Done. Let Me Save File');
  // await saveFile(workbook);
  console.log('done');

};
