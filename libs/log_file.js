const FileSystem = require("fs");
const dotenv = require("dotenv");
const { timeStamp } = require("console");
dotenv.config();

const LOGFILE = process.env.LOGFILE || "./logs/logs.log";
 
const log_file = async (data) => {
if(timeStamp()-data){
    
  }

  if (!FileSystem.existsSync("./logs")) {
    FileSystem.mkdirSync("./logs");
  }

  const logStream = FileSystem.createWriteStream(LOGFILE, { flags: "a" });
  logStream.write(data + "\n");
  logStream.end();
 
};

module.exports = { log_file };
