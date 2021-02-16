const headerConfig = require("../config/header/config.json");
const chalk = require('chalk');

module.exports = async (processObj) => {
    console.log(chalk.blue(`[Step 2. Generate Header : ${processObj.type}] `));

    let worksheet = processObj.worksheet;

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
        Object.keys(headerConfig).map(v => {
          if(typeof headerConfig[v] == 'object') {
            Object.keys(headerConfig[v]).map(title => {
              rows.push([v, title, headerConfig[v][title]]);
              console.log([v, title, headerConfig[v][title]])
            })
          } else {
            rows.push([v, headerConfig[v]]);
          }
        });
        // rows.push(["고객명", "한국전기연구원"]);
        // rows.push(["시스템명", "전기연구원 검색엔진"]);
        // rows.push(["제품명", "OpenQuery SE - (ElasticSearch 6.5.4)"]);
        // rows.push(["라이센스", "0C574-406F3-7F697-645C1-640F1F"]);
        // rows.push(["설치정보", "IP", "172.30.1.156"]);
        // rows.push(["설치정보", "시스테OS", "Ubuntu 16.04.5 LTS"]);
        // rows.push(["설치정보", "설치위치", "/home/ibricks/keri-search"]);

        worksheet.addRows(rows);
}