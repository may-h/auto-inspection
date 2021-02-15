const checkConfig = require('./step/checkConfig');
const checkConnection = require('./step/checkConnection');
const generateHeader = require('./step/generateHeader');
const inspection = require('./step/inspection');
const generateFooter = require('./step/generateFooter');
const Excel = require("exceljs");
const config = require("./config/footer/config.json");

const stepList = [
    checkConfig, // Step 0 - list에서 Domain을 선택하고 Connection Test.
    checkConnection, // Step 1 - Domian 설정하기.
    generateHeader, // Step 2 - Run Test Chat Flow & Create Output file
    inspection, 
    generateFooter
  ];

const createWorkbook = async (type) => {
  return new Excel.Workbook();
}

const saveFile = async (workbook) => {
  await workbook.xlsx.writeFile("test.xlsx");
  console.log('saved.')
}


module.exports = async (type) => {
  let workbook = await createWorkbook(type); 
  let worksheet = await workbook.addWorksheet(`Inspection-${type}`);

  let processObj = {
    config,
    worksheet,
    type,
    proceed: true, 				// step을 앞으로 진행할지 여부(true면 순차 진행).
    step: 0, 							// 진행할 step.
    cfDomainId: '', 			// Config에서 사용된 Domain ID.
    setDomainId: '', 			// 선택한 Domain ID.
    esClient: {}, 				// elasticsearch server client.
    teanaApi: {}, 				// Teana Api.
    trDataSet: {					// Tr Data Set
      intentSet: [],
      senResult: [],
      sentenceMap: new Map(),
      chatflowSet: [],
    },
    cfTarget: [], 				// 테스트를 수행할 chatflow를 지정할 경우 사용.
    parallelCnt: 10, 			// 병렬 수행할 sentence 개수.
    separateMulti: false,	// MULTI-INTENT를 출력파일에서 따로 분리된 시트로 보기 위한 옵션.
  };

  while (processObj.step > -1) {
    console.log('inside while :', processObj.step)
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
  await saveFile(workbook);
  console.log('done');

};
