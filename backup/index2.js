const Excel = require("exceljs");

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("Inspection");

console.log("started");
worksheet.columns = [
  { header: "Id", key: "id", width: 10 },
  { header: "Name", key: "name", width: 20 },
  { header: "BD", key: "birth", width: 30 },
];

worksheet.addRow({
  id: 1,
  name: "may",
  birth: "1992-10.14",
});

const saveFile = async () => {
  await worksheet.mergeCells("A6:A8");
  await workbook.xlsx.writeFile("export.xlsx");
};

saveFile();

console.log("done");
