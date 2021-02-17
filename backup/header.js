const Excel = require("exceljs");
const exec = require("../excute.js").module;
const inspection_list = require("../commands.json");
const names = require("../names.json");

const workbook = new Excel.Workbook();
const worksheet = workbook.addWorksheet("Inspection");

worksheet.columns = [
  { header: "세부 점검 항목", key: "name", width: 20 },
  { header: "명령어", key: "command", width: 20 },
  { header: "출력 내용", key: "response", width: 70 },
  { header: "CHECK POINT", key: "checkPoint", width: 20 },
  { header: "점검 결과", key: "result", width: 10 },
  { header: "점검 내용", key: "opinion", width: 10 },
];

//=============== 제목 ===================//

worksheet.mergeCells("A1:F1");
const header = worksheet.getCell("A1");
header.value = "점 검 확 인 서";
header.alignment = {
  vertical: "middle",
  horizontal: "center",
};

//=============== 정검 대상 ===================//
const rows = [];
rows.push(["고객명", "한국전기연구원"]);
rows.push(["시스템명", "전기연구원 검색엔진"]);
rows.push(["제품명", "OpenQuery SE - (ElasticSearch 6.5.4)"]);
rows.push(["라이센스", "0C574-406F3-7F697-645C1-640F1F"]);
rows.push(["설치정보", "IP", "172.30.1.156"]);
rows.push(["설치정보", "시스테OS", "Ubuntu 16.04.5 LTS"]);
rows.push(["설치정보", "설치위치", "/home/ibricks/keri-search"]);

worksheet.addRows(rows);

//=============== 점검 시작 ===================//
worksheet.addRow({});

const setDefaul = (row) => {
  row.height = 81;
  row.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
};

const putCategoryRow = async (name) => {
  const newRow = await worksheet.addRow({ name });
  newRow.height = 26;
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  const number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);
};

const work = async () => {
  //["CPU", "SERVICE_STATUS", "DISK_STATUS", "LOGS"]
  for (category of Object.keys(inspection_list)) {
    await putCategoryRow(names[category]);
    const commands = inspection_list[category];
    for (command of commands) {
      // command.response = command.response || (await exec(command.command));
      const newRow = await worksheet.addRow(command);
      console.log(newRow.number);
      await setDefaul(newRow);
    }
  }
};

//=============== Footer ===================//

const putFooter = async () => {
  let newRow = await worksheet.addRow(["특이사항"]);
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  let number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);

  newRow = await worksheet.addRow(["입력하세요."]);
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  newRow.height = 88;
  number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);

  newRow = await worksheet.addRow(["고객 의견"]);
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);

  newRow = await worksheet.addRow(["입력하세요"]);
  newRow.height = 88;
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);

  newRow = await worksheet.addRow([
    "위와 같이 시스템 정밀점검을 실시하였음을 확인합니다. \n\n    년     월      일",
  ]);
  newRow.height = 88;
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  number = newRow.number;
  await worksheet.mergeCells(`A${number}:F${number}`);

  newRow = await worksheet.addRow(["고객사 담당자:       (인)"]);
  newRow.height = 40;
  newRow.alignment = {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  };
  number = newRow.number;
  await worksheet.mergeCells(`A${number}:D${number}`);
  worksheet.getCell(`E${number}`).value = "점검자 :      (인)";
  await worksheet.mergeCells(`E${number}:F${number}`);
};

//=============== 파일 저장 ===================//
const saveFile = async () => {
  await work();
  await putFooter();
  await workbook.xlsx.writeFile(`${require('app-root-path').path}/output/header.xlsx`);
  console.log("done");
};

saveFile();
