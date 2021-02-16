const shell = require("shelljs");

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
    let result = await cd("/Users/may-han/study/coding_test")
    if(result) {
        await exec("pwd");
    } else {
        console.log("no directory")

    };
    
}

work();