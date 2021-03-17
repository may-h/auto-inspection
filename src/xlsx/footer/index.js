const xlsx = require("../utils/xlsx");
const config = require("../config/config");

//================== 3. Footer ==================//
module.exports = async (worksheet) => {
        let footer_config = config.footer_config;
    
        for (value of footer_config) {
          let mergeCells = value.mergeCells;
          let bgColor = value.bgColor;
          let rowCount = value.rowCount || 1;
          let subColumn = value.subColumn;
          let height = value.height || 20;
    
          let newRow = await worksheet.addRow([value.title]);
          let number = newRow.number;
    
          //Merge Cells
          if (mergeCells !== undefined) {
            xlsx.mergeCells(
              worksheet,
              `${mergeCells.split(":")[0] + number}`,
              `${mergeCells.split(":")[1] + number}`
            );  
          };


          // 옆칸에 subColumn이 들어갈 때
          if (subColumn !== undefined) {

            xlsx.mergeCells(
              worksheet,
              `${subColumn.mergeCells.split(":")[0] + number}`,
              `${subColumn.mergeCells.split(":")[1] + number}`
            );
            
            xlsx.setValue(worksheet, `${subColumn.mergeCells.split(":")[0] + number}`, subColumn.title); 
          }

          //Add Style
          xlsx.setRowAlign(worksheet, newRow, "center"); //정렬.
          xlsx.setFill(worksheet, `A${number}`, bgColor); // 셀 색 설정.
          xlsx.setBorderLine(worksheet, newRow); // border 설정.
    

          // 높이 설정
          if(height) {
            xlsx.setHeight(newRow, height);
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