const shell = require("shelljs");

const exec = async (command) => {
  const response = await shell.exec(command);
  if (response.code !== 0 || response == "") {
    return `Error Occure, Please check manually : ${response.stderr}`;
  }
  return response.stdout;
};

const cd = async(path) => {
  await shell.cd(path);
}

const command = "lscpu | grep 'CPU(s):' | grep -v NUMA | awk '{printf $2}'";

const work = async() => {
    const result = await exec(command);
    console.log('res -> ', result);
}

work();