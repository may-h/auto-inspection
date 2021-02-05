const Excel = require("exceljs");

const workbook = new Excel.Workbook();
const ws = workbook.addWorksheet("Inspection");

let newRow = ws.addRow("nice");
newRow.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD3D3D3" }, //LightGray
  //   bgColor: { argb: "FF00FF00" },
};

ws.getCell("A4").value = "hello";
ws.getCell("A4").fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFD3D3D3" }, //LightGray
  //   bgColor: { argb: "FF00FF00" },
};

ws.getCell("A5").value = "silver";
ws.getCell("A5").font = { color: { argb: "FFFFFFFF" }, bold: true };
ws.getCell("A5").fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF696969" }, //Dimgray
};

// set single thin border around A1
ws.getCell("A1").border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

//set double thin green border around A3
ws.getCell("A3").border = {
  top: { style: "double", color: { argb: "FF00FF00" } },
  left: { style: "double", color: { argb: "FF00FF00" } },
  bottom: { style: "double", color: { argb: "FF00FF00" } },
  right: { style: "double", color: { argb: "FF00FF00" } },
};

const saveFile = async () => {
  await workbook.xlsx.writeFile("color.xlsx");
  console.log("done");
};

saveFile();
