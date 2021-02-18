const chalk = require('chalk');


//ADD FOOTER 
const addStyle = (type, newRow, bgColor) => {

    switch (type) {
      case "footer":
        newRow.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
        };
        newRow.height = 20;
        newRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: bgColor }, //LightGray
        };
        newRow.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };
        break;
    }
    };


module.exports = async (processObj) => {
  console.log(chalk.blue(`[Step ${processObj.step+1}. Generate Footer : ${processObj.type}]`),);
    let worksheet = processObj.worksheet;
      const addFooterRow = async ({ title, bgColor, rowCount, mergeCells, subColumn }) => {
        let { number } = await worksheet.addRow([title]);
        let merge = mergeCells ? `${mergeCells.split(":")[0] + number}:${mergeCells.split(":")[1] + number}`: `A${number}`;
      
        const newRow = worksheet.getCell(merge.split(":")[0]);
      
        //Add Style
        await addStyle("footer", newRow, bgColor);
      
        //Merge Cells
        if (mergeCells !== undefined) worksheet.mergeCells(merge);
      
        // 옆칸에 subColumn이 들어갈 때 
        if(subColumn !== undefined) {
          const sub = worksheet.getCell(`${subColumn.mergeCells.split(":")[0] + number}`);
          await addStyle('footer', sub, subColumn.bgColor);
          await worksheet.mergeCells(`${subColumn.mergeCells.split(":")[0] + number}:${subColumn.mergeCells.split(":")[1] + number}`);
        }
      
        //빈 row 삽입.
        if (rowCount > 1) {
          for (let i = 1; i < rowCount; i++) {
            const newRow = await worksheet.addRow([]);
            await worksheet.mergeCells(`${mergeCells.split(":")[0] + newRow.number}:${ mergeCells.split(":")[1] + newRow.number}`); 
            newRow.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
            newRow.height = 88;
          }
        }
      };

    for (value of processObj.config) {
        await addFooterRow(value);
    }

}