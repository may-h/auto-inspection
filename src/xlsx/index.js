const utils = require("../../utils");
const common = require("./utils/common.js");
const xlsx = require("./utils/xlsx");
const config = require("./config/config");
const approot = require("app-root-path").path;

module.exports = async (inspection_result) => {
  //workbook, worksheet 생성
  let workbook = await xlsx.createWorkbook();
  let worksheet = await workbook.addWorksheet(`Inspection`);
  worksheet.columns = config.columns_setting; // 컬럼 추가 (필수)

  Promise.resolve()
  .then(async () => {
      // Header
      let ynHeader = await common.ynChoice("파일에 Header를 추가하시겠습니까?");
      if (ynHeader) {
        return require("./header")(worksheet);
      }
    })
    .then(() => {
      // Body
      return require("./body")(worksheet, inspection_result);
    })
    .then(async () => {
      // Footer
      let ynFooter = await common.ynChoice("파일에 Footer을 추가하시겠습니까?");
      if (ynFooter) {
        return require("./footer")(worksheet);
      }
    })
    .then(async() => {
      // File save
      const filename = await utils.getFilename();
      await workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
    })
    .catch((err) => {
      console.log('[ERROR] ', err.toString());
    });
};
