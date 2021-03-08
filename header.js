const Excel = require("exceljs");
const utils = require("./utils");
const inquirer = require("inquirer");
const chalk = require("chalk");

const approot = require("app-root-path").path;

let start = async (inspection_result) => {
  //workbook 생성
  const createWorkbook = async () => {
    return new Excel.Workbook();
  };

  const setDefaul = (row) => {
    // row.height = 81;
    row.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
  };

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
      //   fgColor: { argb: "FFD3D3D3" },
      fgColor: { argb: "FFA9A9A9" },
    }; //배경색상.
    worksheet.getCell(`A${newRow.number}`).font = {
      name: "Malgun Gothic",
      family: 4,
      size: 11,
      color: { argb: "FFFFFFFF" },
      bold: true,
    };
    await worksheet.mergeCells(`A${newRow.number}:F${newRow.number}`); //merge.
  };

  let workbook = await createWorkbook();
  let worksheet = await workbook.addWorksheet(`Inspection`);

  //본문 출력
  worksheet.columns = [
    { header: "세부 점검 항목", key: "name", width: 20 },
    { header: "명령어", key: "command", width: 20 },
    { header: "출력 내용", key: "response", width: 70 },
    { header: "CHECK POINT", key: "checkPoint", width: 20 },
    { header: "점검 결과", key: "result", width: 10 },
    { header: "점검 내용", key: "opinion", width: 10 },
  ];

  let header_input = [
    "고객명",
    "시스템명",
    "제품명",
    "라이센스",
    "IP",
    "시스템OS",
    "설치위치",
  ];
  let header_result = {
    고객명: "한국전기연구원",
    시스템명: "몰라",
    제품명: "Openquery",
    라이센스: "dogdlkang",
    IP: "103444",
    시스템OS: "ubuntu",
    설치위치: "/home/appl",
  };

  worksheet.mergeCells("A1:F1");
  worksheet.getRow(1).getCell(1).value = "점 검 확 인 서";
  worksheet.getCell("A1").height = 50;
  worksheet.getCell("A1").font = {
    name: "Malgun Gothic",
    family: 4,
    size: 40,
    bold: true,
  };
  worksheet.getRow(1).getCell(1).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  let headerStyled = (key, value, newRow) => {
    switch(key){
        case '고객명':
        case '시스템명':
        case '제품명':
            newRow.height = 26;
            // newRow.border = {
            //     top: {style:'thin'},
            //     left: {style:'thin'},
            //     bottom: {style:'thin'},
            //     right: {style:'thin'}
            // };
              
            worksheet.getCell(`A${newRow.number}`).value = key;
            worksheet.getCell(`A${newRow.number}`).fill = 
            {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD3D3D3" },
            };
            worksheet.mergeCells(`B${newRow.number}:C${newRow.number}`);
            worksheet.getCell(`B${newRow.number}`).value = value; 
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

  for (key of Object.keys(header_result)) {
      
    let newRow = await worksheet.addRow({});
    await headerStyled(key, header_result[key], newRow);
    
  }

  const filename = await utils.getFilename();
  await workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
};

start();
