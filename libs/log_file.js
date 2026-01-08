const FileSystem = require("fs");

const log_file = async (data) => {
  FileSystem.appendFile("./logs/logs.log", `${data}\n`, function (err) {
    if (err) throw err;
    console.log("Log file created/appended.");
  });
};

module.exports = { log_file };
