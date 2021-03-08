const Excel = require('exceljs');
const utils = require('./utils');
const inquirer = require('inquirer');
const chalk = require('chalk')

const approot = require("app-root-path").path;
const { command } = require('commander');

const inspection_result = {
    "CPU 상태 점검": [
        {
            "name": "Cpu core 수 점검",
            "command": "lscpu | grep 'CPU(s):' | grep -v NUMA | awk '{printf $2}'",
            "checkPoint": "대상 시스템의 CPU Core 수를 확인한다.",
            "response": ""
        },
        {
            "name": "Load Average 확인",
            "command": "cat /proc/loadavg | awk '{printf $1\" \"$2\" \"$3}'",
            "checkPoint": "User APP의  CPU 사용률을 확인하여 비정상/정상 유무를 판단한다.",
            "response": ""
        }
    ],
    "Service 상태 점검": [
        {
            "name": "Elasticsearch 상태 확인",
            "command": "ps -ef | grep elasticsearch | grep -v 'grep'",
            "checkPoint": "Elasticsearch 서비스 활성화 여부를 확인한다.",
            "response": "[ERROR] Occure, Please check manually : "
        },
        {
            "name": "Elasticsearch Cluster 상태 확인",
            "command": "curl localhost:undefined/_cluster/health?pretty",
            "checkPoint": "Elasticsearch Cluster 상태를 확인한다.",
            "response": "[ERROR] Occure, Please check manually : curl: (3) URL using bad/illegal format or missing URL\n"
        },
        {
            "name": "데이터 색인 상태 확인",
            "command": "curl localhost:undefined/_cat/indices?s=i:desc",
            "checkPoint": "색인된 인덱스 상태를 확인한다.",
            "response": "[ERROR] Occure, Please check manually : curl: (3) URL using bad/illegal format or missing URL\n"
        },
        {
            "name": "OpenQuery 상태 확인 ",
            "command": "./console list ",
            "checkPoint": "OpenQuery SE 서비스 활성화 여부를 확인한다.",
            "path": "/home/sop/openquery-management-console-2.4.6/bin/",
            "response": "no directory : /home/sop/openquery-management-console-2.4.6/bin/"
        }
    ],
    "Disk 상태 점검": [
        {
            "name": "시스템 디스크 용량 확인",
            "command": "df -h",
            "checkPoint": "현재 사용가능한 디스크 용량을 확인한다.",
            "response": "Filesystem                                     Size   Used  Avail Capacity iused      ifree %iused  Mounted on\n/dev/disk1s1                                  466Gi   10Gi  295Gi     4%  488473 4881964407    0%   /\ndevfs                                         191Ki  191Ki    0Bi   100%     660          0  100%   /dev\n/dev/disk1s2                                  466Gi  156Gi  295Gi    35% 2641126 4879811754    0%   /System/Volumes/Data\n/dev/disk1s5                                  466Gi  3.0Gi  295Gi     2%       3 4882452877    0%   /private/var/vm\nmap auto_home                                   0Bi    0Bi    0Bi   100%       0          0  100%   /System/Volumes/Data/home\n/Users/may-han/Downloads/Scroll Reverser.app  466Gi  156Gi  297Gi    35% 2657450 4879795430    0%   /private/var/folders/q2/prpmdzgj34x994jw8jr30c1m0000gn/T/AppTranslocation/A4D0279A-1D76-407E-898C-7DF3C2B6C215\n/dev/disk2s1                                  882Mi  871Mi   12Mi    99%    4174 4294963105    0%   /Volumes/PyCharm CE\n/dev/disk1s4                                  466Gi  504Mi  295Gi     1%      53 4882452827    0%   /Volumes/Recovery\n"
        },
        {
            "name": "Elasticsearch 색인 데이터 용량 확인",
            "command": "du -h --max-depth=1",
            "checkPoint": "색인 데이터의 전체 용량을 확인하여 Disk Full를 사전에 방지한다.",
            "path": "/home/sop/elastic/elasticsearch-6.5.4/",
            "response": "no directory : /home/sop/elastic/elasticsearch-6.5.4/"
        },
        {
            "name": "시스템 메모리 확인",
            "command": "free -h",
            "checkPoint": "사용 가능한 메모리 용량을 확인하여 Out Of Memory Error를 사전에 방지한다.",
            "response": "[ERROR] Occure, Please check manually : /bin/sh: free: command not found\n"
        }
    ],
    "Log 상태 점검": [
        {
            "name": "Elasticsearch log",
            "command": "zcat *.log.gz | grep ERROR",
            "response": "로그를 직접 확인해주세요.",
            "checkPoint": "Elasticsearch Log를 확인하여 ERROR가 발생했는지 확인한다"
        },
        {
            "name": "수집기 log",
            "command": "cat *.log | grep ERROR",
            "response": "로그를 직접 확인해주세요.",
            "checkPoint": "'수집기 log를 확인하여 ERROR가 발생했는지 확인한다. "
        },
        {
            "name": "openquery log ",
            "command": "./console logs",
            "response": "로그를 직접 확인해주세요.",
            "checkPoint": "Openquery Log를 확인하여 ERROR가 발생했는지 확인한다"
        }
    ]
};


let start = async (inspection_result) => {
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

  const setDefaul = (row) => {
    // row.height = 81;
    row.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    row.eachCell(function(cell, colNumber) {
        // console.log(cell._address);
        worksheet.getCell(cell._address).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

      });
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
        name: 'Malgun Gothic',
        family: 4,
        size: 11,
        color: {'argb': 'FFFFFFFF'},
        bold: true
    };
    await worksheet.mergeCells(`A${newRow.number}:F${newRow.number}`); //merge.
    row.eachCell(function(cell, colNumber) {
        // console.log(cell._address);
        worksheet.getCell(cell._address).border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

      });
  };

  let workbook = await createWorkbook();
  let worksheet = await workbook.addWorksheet(`Inspection`);

  //==== header ====// 
//   let { choice } = await inquirer.prompt([
//     {
//       type: "confirm",
//       message: chalk.blue(`파일에 Header를 추가하시겠습니까?`),
//       name: "choice",
//     },
//   ]);

  //header 추가
//   if (choice) {
    //본문 출력 
    worksheet.columns = [
        { header: "세부 점검 항목", key: "name", width: 20 },
        { header: "명령어", key: "command", width: 20 },
        { header: "출력 내용", key: "response", width: 70 },
        { header: "CHECK POINT", key: "checkPoint", width: 20 },
        { header: "점검 결과", key: "result", width: 15 },
        { header: "점검 내용", key: "opinion", width: 15 },
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
        "고객명": "한국전기연구원",
        "시스템명": "몰라",
        "제품명": "Openquery",
        "라이센스": "dogdlkang",
        "IP": "103444",
        "시스템OS": "ubuntu",
        "설치위치": "/home/appl"
    };

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
    // const header = worksheet.getCell("A1");
    // header.value = "점 검 확 인 서";
    // header.alignment = {
    // vertical: "middle",
    // horizontal: "center",
    // };

    // await worksheet.getRow(1).commit();


    //header값 입력 받기. 
    // for (key of header_input) {
    //     const { res } = await inquirer.prompt([
    //       {
    //         type: "input",
    //         message: `${key} :`,
    //         name: "res",
    //       },
    //     ]);
    //     header_result[key] = res;
    // };

    // let { isCorrect } = await inquirer.prompt([
    //     {
    //       type: "confirm",
    //       message: `입력한 내용이 맞습니까? \n${JSON.stringify(header_result, null, 4)}`, 
    //       name: "isCorrect",
    //     },
    // ]);
    // if (isCorrect) {
        for(key of Object.keys(header_result)){
            // await worksheet.addRow([key, header_result[key]]);
            let newRow = await worksheet.addRow({});
            await headerStyled(key, header_result[key], newRow);
        }
    // }
//   }

    worksheet.addRow({}); //시작 전 
    let row = worksheet.addRow(["세부 점검 항목", "명령어", "출력 내용", "CHECK POINT", "점검 결과", "점검 내용"]);
    row.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      }

//   //본문 출력 
//   worksheet.columns = [
//     { header: "세부 점검 항목", key: "name", width: 20 },
//     { header: "명령어", key: "command", width: 20 },
//     { header: "출력 내용", key: "response", width: 70 },
//     { header: "CHECK POINT", key: "checkPoint", width: 20 },
//     { header: "점검 결과", key: "result", width: 10 },
//     { header: "점검 내용", key: "opinion", width: 10 },
//   ];

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
//   let { choice2 } = await inquirer.prompt([
//     {
//       type: "confirm",
//       message: chalk.blue(`파일에 Footer을 추가하시겠습니까?`),
//       name: "choice2",
//     },
//   ]);


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

//   if(choice2) {
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
            // newRow.border = {
            //   top: { style: "thin" },
            //   left: { style: "thin" },
            //   bottom: { style: "thin" },
            //   right: { style: "thin" },
            // };
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
//   }

  const filename = await utils.getFilename();
  await workbook.xlsx.writeFile(`${approot}/output/${filename}.xlsx`);
};


start(inspection_result);