const xlsx = require("../utils/xlsx");
const config = require("../config/config");

//================== 2. body (inspection result) ==================//

module.exports = async (worksheet, inspection_result) => {
    // body의 카테고리 행 스타일 추가.
    const putCategoryRow = async (name) => {
      const newRow = await worksheet.addRow({ name });
      xlsx.setHeight(newRow, 20);
      xlsx.setRowAlign(worksheet, newRow, "center"); //정렬.
      xlsx.setFill(worksheet, `A${newRow.number}`, "FFA9A9A9"); //배경색상.
      xlsx.setCellFont(worksheet, `A${newRow.number}`, "Malgun Gothic", 11, true); //폰트설정
      xlsx.mergeCells(worksheet, `A${newRow.number}`, `F${newRow.number}`);
      xlsx.setBorderLine(worksheet, newRow); // border 설정.
    };
    
    xlsx.addRow(worksheet, {}); //시작 전 빈행 삽입.
    // worksheet.addRow({}); //시작 전 빈행 삽입.

    let newRow = worksheet.addRow(config.columns_title);
    xlsx.setRowAlign(worksheet, newRow, "center"); //정렬.
  
    for (category of Object.keys(inspection_result)) {
      await putCategoryRow(category);
      const commands = inspection_result[category];
      for (let command of commands) {
        command.result = "-";
        command.opinion = "-";
        const newRow = await worksheet.addRow(command);
  
        xlsx.setBorderLine(worksheet, newRow);
        xlsx.setRowAlign(worksheet, newRow, "left");
        // await setDefaul(newRow);
      }
    }
  
}