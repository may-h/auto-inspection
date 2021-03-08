const Excel = require('exceljs');
const utils = require('../../utils');
const inquirer = require('inquirer');
const chalk = require('chalk');
const common = require('./common.js');

const approot = require("app-root-path").path;

module.exports = async (inspection_result) => {
  //workbook 생성
  const createWorkbook = async () => {
    return new Excel.Workbook();
  };

   // header 스타일 및 컬럼 추가. 
   let headerStyled = (key, value, newRow) => {
    switch(key){
        case '고객명':
        case '시스템명':
        case '제품명':
            newRow.height = 26;
              
            worksheet.getCell(`A${newRow.number}`).value = key;
            worksheet.getCell(`A${newRow.number}`).fill = 
            {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" },
            };
            worksheet.mergeCells(`B${newRow.number}:C${newRow.number}`);
            worksheet.getCell(`B${newRow.number}`).value = value; 
            //점걸일자, 점검시간, 점검자 컬럼 추가. 
            worksheet.getCell(`D${newRow.number}`).value = key == '고객명' ? '점검일자' : key == '시스템명' ? '점검시간' : '점검자';
            worksheet.getCell(`D${newRow.number}`).fill = 
            {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" },
            };
            worksheet.mergeCells(`E${newRow.number}:F${newRow.number}`);
            newRow.eachCell(function(cell, colNumber) {
                // console.log(cell._address);
                worksheet.getCell(cell._address).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'}
                };

                worksheet.getCell(cell._address).alignment = {
                    vertical: "middle",
                    horizontal: "center",
                    wrapText: true,
                  }
              });
            break;
            case 'IP':
            case '시스템OS':
            case '설치위치': 
                newRow.height = 26;
                if(newRow.getCell(1).value !== '설치정보') {
                    // worksheet.mergeCells(`A${newRow.number}:A${newRow.number+2}`);
                    worksheet.getCell(`A${newRow.number}`).value = '설치정보'
                    worksheet.getCell(`A${newRow.number}`).fill =             
                    {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFD3D3D3" },
                    };
                }

                worksheet.getCell(`B${newRow.number}`).value = key;
                worksheet.mergeCells(`C${newRow.number}:F${newRow.number}`);
                worksheet.getCell(`C${newRow.number}`).value = value;
                newRow.eachCell(function(cell, colNumber) {
                    // console.log(cell._address);
                    worksheet.getCell(cell._address).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    };
    
                    worksheet.getCell(cell._address).alignment = {
                        vertical: "middle",
                        horizontal: "center",
                        wrapText: true,
                      }
                  });
                  
                if(key == '설치위치') { //설치 정보 셀 Merge 
                    worksheet.mergeCells(`A${newRow.number-2}:A${newRow.number}`);
                }
            break;
            default: 
                newRow.height = 26;
                worksheet.getCell(`A${newRow.number}`).value = key;
                worksheet.getCell(`A${newRow.number}`).fill = 
                {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFD3D3D3" },
                };
                worksheet.mergeCells(`B${newRow.number}:F${newRow.number}`);
                worksheet.getCell(`B${newRow.number}`).value = value; 
                newRow.eachCell(function(cell, colNumber) {
                    // console.log(cell._address);
                    worksheet.getCell(cell._address).border = {
                        top: {style:'thin'},
                        left: {style:'thin'},
                        bottom: {style:'thin'},
                        right: {style:'thin'}
                    };
    
                    worksheet.getCell(cell._address).alignment = {
                        vertical: "middle",
                        horizontal: "center",
                        wrapText: true,
                      }
                  });

              break;

    }
  } 


  // body의 디폴트 스타일 추가. 
  const setDefaul = (row) => {
    row.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    row.eachCell(function(cell, colNumber) {
        worksheet.getCell(cell._address).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

      });
  };

  // body의 카테고리 행 스타일 추가. 
  const putCategoryRow = async (name) => {
    const newRow = await worksheet.addRow({ name });
    newRow.height = 20;
    newRow.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    }; //정렬.
    worksheet.getCell(`A${newRow.number}`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFA9A9A9" },
    }; //배경색상.
    worksheet.getCell(`A${newRow.number}`).font = {
        name: 'Malgun Gothic',
        family: 4,
        size: 11,
        color: {'argb': 'FFFFFFFF'},
        bold: true
    }; // 폰트 설정. 

    await worksheet.mergeCells(`A${newRow.number}:F${newRow.number}`); //merge.
    
    row.eachCell(function(cell, colNumber) {
        worksheet.getCell(cell._address).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

      }); // border 설정. 
  };

  //workbook, worksheet 생성 
  let workbook = await createWorkbook();
  let worksheet = await workbook.addWorksheet(`Inspection`);

  // 컬럼 추가 (필수)
  worksheet.columns = [
    { header: "세부 점검 항목", key: "name", width: 20 },
    { header: "명령어", key: "command", width: 20 },
    { header: "출력 내용", key: "response", width: 70 },
    { header: "CHECK POINT", key: "checkPoint", width: 20 },
    { header: "점검 결과", key: "result", width: 10 },
    { header: "점검 내용", key: "opinion", width: 10 },
  ];

  //================== 1. header ==================// 

  // header를 넣을 건지 질문. 
  // let { choice } = await inquirer.prompt([
  //   {
  //     type: "confirm",
  //     message: chalk.blue(`파일에 Header를 추가하시겠습니까?`),
  //     name: "choice",
  //   },
  // ]);

  let ynHeader =  await common.ynChoice('파일에 Header를 추가하시겠습니까?');
  console.log('ynChoice =>' , answer);

  //header 추가
  if (ynHeader) {
    // '점검확인서' 타이틀 추가. 
    worksheet.mergeCells("A1:F1");
    worksheet.getRow(1).getCell(1).value = "점 검 확 인 서";
    worksheet.getCell('A1').height = 50; 
    worksheet.getCell('A1').font = {
        name: 'Malgun Gothic',
        family: 4,
        size: 40,
        bold: true
      };
    worksheet.getRow(1).getCell(1).alignment = {
        vertical: "middle",
        horizontal: "center"
      };


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

    

    //header값 입력 받기. 
    for (key of header_input) {
        const { input } = await inquirer.prompt([
          {
            type: "input",
            message: `${key} :`,
            name: "input",
          },
        ]);
        header_result[key] = input;
    };

    // 입력된 header 정보가 맞는지 확인 질문. 
    let { isCorrect } = await inquirer.prompt([
        {
          type: "confirm",
          message: `입력한 내용이 맞습니까? \n${JSON.stringify(header_result, null, 4)}`, 
          name: "isCorrect",
        },
    ]);

    // header 정보를 엑셀 행에 추가. 
    if (isCorrect) {
        for(key of Object.keys(header_result)){
          let newRow = await worksheet.addRow({});
          await headerStyled(key, header_result[key], newRow);
        }
    }
  }


  //================== 2. body (inspection result) ==================//
  
  worksheet.addRow({}); //시작 전 빈행 삽입. 
  let row = worksheet.addRow(["세부 점검 항목", "명령어", "출력 내용", "CHECK POINT", "점검 결과", "점검 내용"]);
  row.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    }
  
  //터미널 콘솔 출력.
  for (category of Object.keys(inspection_result)) {
    await putCategoryRow(category);
    const commands = inspection_result[category];
    for (let command of commands) {
      command.result = '-';
      command.opinion = '-';
      const newRow = await worksheet.addRow(command);
      await setDefaul(newRow);
    }
  }



  //==== footer ====// 
  let { choice2 } = await inquirer.prompt([
    {
      type: "confirm",
      message: chalk.blue(`파일에 Footer을 추가하시겠습니까?`),
      name: "choice2",
    },
  ]);


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

  if(choice2) {
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
            newRow.eachCell(function(cell, colNumber) {
              worksheet.getCell(cell._address).border = {
                  top: {style:'thin'},
                  left: {style:'thin'},
                  bottom: {style:'thin'},
                  right: {style:'thin'}
              };

              worksheet.getCell(cell._address).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                  wrapText: true,
                }
            });
            newRow.height = 88;
          }
        }
      };

    let footer_config = [
        {
        "title": "특이사항",
        "bgColor": "FFD3D3D3",
        "rowCount": "2",
        "mergeCells": "A:F"
      },
      {
        "title": "고객의견",
        "bgColor": "FFD3D3D3",
        "rowCount": "2",
        "mergeCells": "A:F"
      },
      {
        "title":
          "위와 같은 시스템 정밀점검을 실시하였음을 확인 합니다.  \n\n     년     월      일",
        "bgColor": "FFFFFFFF",
        "rowCount": "1",
        "mergeCells": "A:F"
      },
      {
        "title": "고객사 담당자:       (인)",
        "bgColor": "FFFFFFFF",
        "rowCount": "1",
        "mergeCells": "A:D",
        "subColumn" : {
            "title": "점검자 :      (인)",
            "bgColor": "FFFFFFFF",
            "rowCount": "1",
            "mergeCells": "E:F"
        }
      }
    ]

    for (value of footer_config) {
        await addFooterRow(value);
    }
  }

  const filename = await utils.getFilename();
  await workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
};
