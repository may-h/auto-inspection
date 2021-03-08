const xlsx = require("../utils/xlsx");
const config = require("../config/config");

//================== 3. Footer ==================//
module.exports = async (worksheet) => {
        let footer_config = config.footer_config;
    
        for (value of footer_config) {
          let mergeCells = value.mergeCells;
          let bgColor = value.bgColor;
          let rowCount = value.rowCount;
          let subColumn = value.subColumn;
    
          let newRow = await worksheet.addRow([value.title]);
          let number = newRow.number;
    
          //Merge Cells
          if (mergeCells !== undefined)
            xlsx.mergeCells(
              worksheet,
              `${mergeCells.split(":")[0] + number}`,
              `${mergeCells.split(":")[1] + number}`
            );
    
          //Add Style
          xlsx.setRowAlign(worksheet, newRow, "center"); //정렬.
          xlsx.setHeight(newRow, 20); // 높이 설정.
          xlsx.setFill(worksheet, `A${number}`, bgColor); // 셀 색 설정.
          xlsx.setBorderLine(worksheet, newRow); // border 설정.
    
          // 옆칸에 subColumn이 들어갈 때
          if (subColumn !== undefined) {
            const subRow = worksheet.getRow(
              `${subColumn.mergeCells.split(":")[0] + number}`
            );
    
            xlsx.setRowAlign(worksheet, subRow, "center"); //정렬.
            xlsx.setHeight(subRow, 40);
            xlsx.setRowFill(worksheet, subRow, bgColor);
            xlsx.setBorderLine(worksheet, subRow); // border 설정.
    
            xlsx.mergeCells(
              worksheet,
              `${subColumn.mergeCells.split(":")[0] + number}`,
              `${subColumn.mergeCells.split(":")[1] + number}`
            );
          }
    
          //빈 row 삽입.
          if (rowCount > 1) {
            for (let i = 1; i < rowCount; i++) {
              const newRow = await worksheet.addRow([]);
              xlsx.mergeCells(
                worksheet,
                `${mergeCells.split(":")[0] + newRow.number}`,
                `${mergeCells.split(":")[1] + newRow.number}`
              );
              xlsx.setBorderLine(worksheet, newRow);
              xlsx.setRowAlign(worksheet, newRow, "center");
              xlsx.setHeight(newRow, 88);
            }
          }
        }
    
}