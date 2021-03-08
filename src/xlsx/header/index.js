const common = require("../utils/common.js");
const xlsx = require("../utils/xlsx");
const config = require("../config/config");

//================== 1. header ==================//
module.exports = async (worksheet) => {
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
let isCorrect = await common.ynChoice(
  `입력한 내용이 맞습니까? \n${JSON.stringify(header_result, null, 4)}`
);

// header 정보를 엑셀 행에 추가.
if (isCorrect) {
  for (key of Object.keys(header_result)) {
    let newRow = await worksheet.addRow({});
    await headerStyled(key, header_result[key], newRow, newRow.number);
  }
}
};