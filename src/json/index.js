const fs = require('fs');
const utils = require('../../utils');
const approot = require('app-root-path').path;

//JSON 파일 저장. 
module.exports = async (inspection_result) => {
    try {
        const filename = await utils.getFilename();
        fs.writeFileSync(`${approot}/output/${filename}.json`, JSON.stringify(inspection_result, null, 4), 'utf8');
    } catch(err) {
        console.log('ERROR -> ', err)
    }
    
}