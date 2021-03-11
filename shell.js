const shell = require("shelljs");
const response = shell.exec('curl localhost:9200');
if (response.code !== 0) {
  return false;
}
// console.log(response.stdout)
// console.log(response.stderr);