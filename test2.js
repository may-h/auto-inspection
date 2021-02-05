const approot = require('app-root-path');

console.log(`${approot.path}/config/config.json`);

const shell = require("shelljs");
const response = shell.cd('/Users/may-han/study');
console.log(response)
// const res = shell.exec('du -h -d 1');

// console.log(res.stdout)