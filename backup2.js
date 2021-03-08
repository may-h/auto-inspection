const utils = require("../../utils");
const common = require("./utils/common.js");
const xlsx = require("./utils/xlsx");
const config = require('./config');

const approot = require("app-root-path").path;

module.exports = async (inspection_result) => {
  //workbook, worksheet 생성
  let workbook = await xlsx.createWorkbook();
  let worksheet = await workbook.addWorksheet(`Inspection`);

  // 컬럼 추가 (필수)
  worksheet.columns = config.columns_setting;

  // header 스타일 및 컬럼 추가.
  let headerStyled = (key, value, newRow, rowNum) => {
    switch (key) {
      case "고객명":
      case "시스템명":
      case "제품명":
        xlsx.setHeight(newRow, 26);
        xlsx.setValue(worksheet, `A${rowNum}`, key);
        xlsx.setFill(worksheet, `A${rowNum}`, "FFD3D3D3");
        xlsx.mergeCells(worksheet, `B${rowNum}`, `C${rowNum}`);
        xlsx.setValue(worksheet, `B${rowNum}`, value);

        let cellValue =
          key == "고객명"
            ? "점검일자"
            : key == "시스템명"
            ? "점검시간"
            : "점검자";
        xlsx.setValue(worksheet, `D${rowNum}`, cellValue);
        xlsx.setFill(worksheet, `D${rowNum}`, "FFD3D3D3");
        xlsx.mergeCells(worksheet, `E${rowNum}`, `F${rowNum}`);
        xlsx.setBorderLine(worksheet, newRow);
        xlsx.setRowAlign(worksheet, newRow, "center");

        break;
      case "IP":
      case "시스템OS":
      case "설치위치":
        xlsx.setHeight(newRow, 26);
        if (newRow.getCell(1).value !== "설치정보") {
          xlsx.setValue(worksheet, `A${rowNum}`, "설치정보");
          xlsx.setFill(worksheet, `A${newRow.number}`, "FFD3D3D3");
        }

        xlsx.setValue(worksheet, `B${rowNum}`, key);
        xlsx.mergeCells(worksheet, `C${rowNum}`, `F${rowNum}`);
        xlsx.setValue(worksheet, `C${rowNum}`, value);
        xlsx.setBorderLine(worksheet, newRow);
        xlsx.setRowAlign(worksheet, newRow, "center");

        if (key == "설치위치") {
          //설치 정보 셀 Merge
          xlsx.mergeCells(worksheet, `A${rowNum - 2}`, `A${rowNum}`);
        }
        break;
      default:
        xlsx.setHeight(newRow, 26);

        xlsx.setValue(worksheet, `A${rowNum}`, key);
        xlsx.setFill(worksheet, `A${rowNum}`, "FFD3D3D3");
        xlsx.mergeCells(worksheet, `B${rowNum}`, `F${rowNum}`);
        xlsx.setValue(worksheet, `B${rowNum}`, value);

        xlsx.setBorderLine(worksheet, newRow);
        xlsx.setRowAlign(worksheet, newRow, "center");

        break;
    }
  };

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

  //================== 1. header ==================//
  // header를 넣을 건지 질문.
  let ynHeader = await common.ynChoice("파일에 Header를 추가하시겠습니까?");

  if (ynHeader) {
    // '점검확인서' 타이틀 추가.
    xlsx.mergeCells(worksheet, "A1", "F1");

    xlsx.setValue(worksheet, "A1", "점 검 확 인 서");
    xlsx.setHeight(worksheet.getRow(1), 50);
    xlsx.setCellFont(worksheet, "A1", "Malgun Gothic", 40, true); //폰트설정
    xlsx.setRowAlign(worksheet, worksheet.getRow(1), "center"); //정렬.

    //header값 입력 받기.
    let header_inquire_list = config.header_inquire_list;
    let header_result = await common.getInquireList(header_inquire_list);

    // 입력된 header 정보가 맞는지 확인 질문.
    let isCorrect = await common.ynChoice(`입력한 내용이 맞습니까? \n${JSON.stringify(header_result,  null, 4)}`);

    // header 정보를 엑셀 행에 추가.
    if (isCorrect) {
      for (key of Object.keys(header_result)) {
        let newRow = await worksheet.addRow({});
        await headerStyled(key, header_result[key], newRow, newRow.number);
      }
    }
  }

  //================== 2. body (inspection result) ==================//

  xlsx.addRow(worksheet, {});//시작 전 빈행 삽입.
  // worksheet.addRow({}); //시작 전 빈행 삽입.
  let newRow = worksheet.addRow(config.columns_title);
  xlsx.setRowAlign(worksheet, newRow, "center"); //정렬.


  //터미널 콘솔 출력.
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

  //================== 3. Footer ==================//

  // Footer을 추가할 것인지 질문.
  let ynFooter = await common.ynChoice("파일에 Footer을 추가하시겠습니까?");

  if (ynFooter) {

    let footer_config = config.footer_config;

    for (value of footer_config) {
      let mergeCells = value.mergeCells;
      let bgColor = value.bgColor;
      let rowCount = value.rowCount;
      let subColumn = value.subColumn;

      let newRow = await worksheet.addRow([value.title]);
      let number = newRow.number;

      //Merge Cells
      if (mergeCells !== undefined) xlsx.mergeCells(worksheet, `${mergeCells.split(":")[0] + number}`, `${mergeCells.split(":")[1] + number}`);


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


        xlsx.mergeCells(worksheet, `${subColumn.mergeCells.split(":")[0] + number}`, `${subColumn.mergeCells.split(":")[1] + number}`);

      }


      //빈 row 삽입.
      if (rowCount > 1) {
        for (let i = 1; i < rowCount; i++) {
          const newRow = await worksheet.addRow([]);
          xlsx.mergeCells(worksheet, `${mergeCells.split(":")[0] + newRow.number}`, `${mergeCells.split(":")[1] + newRow.number}`);
          xlsx.setBorderLine(worksheet, newRow);
          xlsx.setRowAlign(worksheet, newRow, "center");
          xlsx.setHeight(newRow, 88);
        }
      }

    }

  }

  const filename = await utils.getFilename();
  await workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
};
