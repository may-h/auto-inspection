const Excel = require("exceljs");

module.exports = (() => {

    /*
     * 싱글톤 패턴 (Singlethon)
    */

    // 비공개 변수, 메서드 정의 
    let workbook; 
    let worksheet;

    const init = () => {
        //싱글톤 객체 정의 
        return {
            createWorkbook: () => { //공개 메서드 정의 
                if(!workbook) {
                    workbook = new Excel.Workbook();
                }
                return workbook;
            },
            publicProp: 'single value' //공개 속성 정의 
        }
    }

    // Public 메서드인 getInstance()를 정의한 객체. 
    // 비공개 변수를 사용하여 메서드에 접근 가능(클로저); 

    return {
        getWorkbook: () => {
            if(!workbook) {
                workbook = init().createWorkbook();
            }
            return workbook;
        },
        getWorksheet: async () => {
            if(!worksheet) {
                if(!workbook) {
                    workbook = init().createWorkbook();
                }
                worksheet =  await workbook.addWorksheet(`Inspection`)
            }
            return worksheet;
        }
    }
})();