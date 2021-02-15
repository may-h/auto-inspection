const shell = require("../excute.js");
const inspection_list = require("../config/inspection/config").modules;
const names = require("../names.json");


module.exports = async (processObj) => {
    console.log(`Step : ${processObj.step}, selected Type : ${processObj.type}`);
    let worksheet = processObj.worksheet;

    worksheet.columns = [
        { header: "세부 점검 항목", key: "name", width: 20 },
        { header: "명령어", key: "command", width: 20 },
        { header: "출력 내용", key: "response", width: 70 },
        { header: "CHECK POINT", key: "checkPoint", width: 20 },
        { header: "점검 결과", key: "result", width: 10 },
        { header: "점검 내용", key: "opinion", width: 10 },
      ];


    const setDefaul = (row) => {
    // row.height = 81;
    row.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    };

    const putCategoryRow = async (name) => {
        const newRow = await worksheet.addRow({ name });
        newRow.height = 26;
        newRow.alignment = {vertical: "middle", horizontal: "center", wrapText: true}; //정렬.
        worksheet.getCell(`A${newRow.number}`).fill = {type: "pattern",pattern: "solid",fgColor: { argb: "FFD3D3D3" }}; //배경색상.
        await worksheet.mergeCells(`A${newRow.number}:F${newRow.number}`); //merge.
      };

    const addLastStyle = () => {
        worksheet.getColumn("name").alignment = {vertical: "middle", horizontal: "center", wrapText: true}; //정렬.

        worksheet.getColumn("command").alignment = {vertical: "middle", horizontal: "center", wrapText: true}; //정렬.;

        worksheet.getColumn("result").fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" }, //Dimgray
        };

        worksheet.getColumn("opinion").fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" }, //Dimgray
        };
    }       


    //["CPU", "SERVICE_STATUS", "DISK_STATUS", "LOGS"]
    for (category of Object.keys(inspection_list)) {
        await putCategoryRow(names[category]);
        const commands = inspection_list[category];
        for (command of commands) {
            if(command.path) await shell.cd(command.path);
            command.response = command.response || (await shell.exec(command.command));
            const newRow = await worksheet.addRow(command);
            console.log(newRow.number);
            await setDefaul(newRow);
        }
    };
}