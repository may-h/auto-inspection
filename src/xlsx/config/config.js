module.exports = {
  columns_setting: [
    { header: "세부 점검 항목", key: "name", width: 20 },
    { header: "명령어", key: "command", width: 20 },
    { header: "출력 내용", key: "response", width: 70 },
    { header: "CHECK POINT", key: "checkPoint", width: 20 },
    { header: "점검 결과", key: "result", width: 10 },
    { header: "점검 내용", key: "opinion", width: 10 },
  ],
  columns_title: [
    "세부 점검 항목",
    "명령어",
    "출력 내용",
    "CHECK POINT",
    "점검 결과",
    "점검 내용",
  ],
  header_inquire_list: [
    "고객명",
    "시스템명",
    "제품명",
    "라이센스",
    "IP",
    "시스템OS",
    "설치위치",
  ],
  footer_config: [
    {
      title: "특이사항",
      bgColor: "FFD3D3D3",
      rowCount: "2",
      mergeCells: "A:F",
    },
    {
      title: "고객의견",
      bgColor: "FFD3D3D3",
      rowCount: "2",
      mergeCells: "A:F",
    },
    {
      title:
        "위와 같은 시스템 정밀점검을 실시하였음을 확인 합니다.  \n\n     년     월      일",
      bgColor: "FFFFFFFF",
      rowCount: "1",
      mergeCells: "A:F",
    },
    {
      title: "고객사 담당자:       (인)",
      bgColor: "FFFFFFFF",
      rowCount: "1",
      mergeCells: "A:D",
      subColumn: {
        title: "점검자 :      (인)",
        bgColor: "FFFFFFFF",
        rowCount: "1",
        mergeCells: "E:F",
      },
    },
  ],
};
