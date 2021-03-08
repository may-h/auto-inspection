const Excel = require("exceljs");
const inquirer = require("inquirer");

let header_input = [
  "고객명",
  "시스템명",
  "제품명",
  "라이센스",
  "IP",
  "시스템OS",
  "설치위치",
];
let header_result = {};

const test = async () => {
  try {
    let { choice } = await inquirer.prompt([
      {
        type: "confirm",
        message: `파일에 Header를 추가하시겠습니까?`,
        name: "choice",
      },
    ]);
    if (!choice) return;

    for (key of header_input) {
      const { res } = await inquirer.prompt([
        {
          type: "input",
          message: `${key} :`,
          name: "res",
        },
      ]);
      header_result[key] = res;
    }

    let { isCorrect } = await inquirer.prompt([
      {
        type: "confirm",
        message: `입력한 내용이 맞습니까? \n${JSON.stringify(header_result, null, 4)}`, 
        name: "isCorrect",
      },
    ]);
    if (isCorrect) console.log("done, saving");

  } catch (err) {
    console.log(err);
  }
};

test();
