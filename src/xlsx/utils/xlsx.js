const Excel = require("exceljs");

module.exports = {
  createWorkbook: async () => {
    // Excel Workbook 생성.
    return new Excel.Workbook();
  },
  setHeight: (row, height) => {
    // 행 높이 설정.
    row.height = height;
  },
  mergeCells: async (worksheet, cell1, cell2) => {
    // Merge
    await worksheet.mergeCells(`${cell1}:${cell2}`);
  },
  setValue: async (worksheet, cell, value) => {
    // 셀에 값 추가.
    worksheet.getCell(cell).value = value;
  },
  setFill: async (worksheet, cell, bgColor) => {
    // 셀 배경색 추가.
    worksheet.getCell(cell).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: bgColor },
    };
  },
  setRowFill: async (worksheet, row, bgColor) => {
    // 행 배경색 추가.
    row.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: bgColor },
    };
  },
  setBorderLine: async (worksheet, row) => {
    // 테두리 설정
    await row.eachCell(function (cell, colNumber) {
      worksheet.getCell(cell._address).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  },
  setRowAlign: async (worksheet, row, alignment) => {
    // 행 정렬.
    await row.eachCell(function (cell, colNumber) {
      worksheet.getCell(cell._address).alignment = {
        vertical: "middle",
        horizontal: alignment,
        wrapText: true,
      };
    });
  },
  setCellFont: (worksheet, cell, fontName, fontSize, fontColor, isBold) => {
    //폰트 설정.
    worksheet.getCell(cell).font = {
      name: fontName,
      family: 4,
      size: fontSize,
      color: { argb: fontColor },
      bold: isBold,
    };
  },
  addRow: (worksheet, value) => {
    // 행 추가.
    return worksheet.addRow(value);
  },
};
