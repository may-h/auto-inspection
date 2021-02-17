const shell = require("shelljs");
const config = require("../config/inspection/config");

const exec = async (command) => {
  const response = await shell.exec(command);
  if (response.code !== 0 || response == "") {
    return `Error Occure, Please check manually : ${response.stderr}`;
  }
  return response.stdout;
};

const cd = async(path) => {
    const response = await shell.cd(path);
    console.log(response)
    if (response.code !== 0 || response == "") {
        return false;
    }
    return true;
}

const work = async() => {
    // await cd("/Users/may-han/ibricks/product/OpenQuerySE/ManagementConsole/openquery-management-console-2.4.1/bin");
    // await exec("pwd")
    // let response = await exec("./console list");
    // if (response.code !== 0 || response == "") {
    //     return "error";
    // } else {
    //     console.log(response.stdout);
    // }

    console.log(JSON.stringify(config["SERVICE_STATUS"][3].path));
}

work();