const checkConfig = require('../step/checkConfig');
const selectForm = require('../step/selectForm');
const generateHeader = require('../step/generateHeader');
const inspection = require('../step/inspection');
const generateFooter = require('../step/generateFooter');
const saveFile = require('../step/saveFile');
const Excel = require("exceljs");
const config = require("../config/footer/config.json");


const stepList = [
    checkConfig,
    selectForm, 
    generateHeader, 
    inspection, 
    generateFooter,
    saveFile
  ];
