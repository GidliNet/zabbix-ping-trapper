const FileSystem = require("fs/promises");
const dotenv = require("dotenv");
const { getCurrentTimeStamp, calculatable } = require("./timestamp");
dotenv.config();

const LOGFILE = process.env.LOGFILE || "./logs/logs.log";
const LOGS_DURATION = process.env.LOGS_DURATION;
const readline = require("readline");
let logStream;
const log_file = async (data) => {
  if (!FileSystem.access("./logs")) {
   await FileSystem.mkdirSync("./logs");
  }


  console.log(FileSystem.access(LOGFILE));
  if (FileSystem.access(LOGFILE)) {
    validateLogDate();
  }
  logStream= await FileSystem.open(LOGFILE,{flags:"a"})
  logStream.write(data + "\n");
  logStream.end();
};

const validateLogDate = async () => {
  const ReadLog = await FileSystem.createReadStream
  const reader =  readline.createInterface({ input: ReadLog });
  const line = await new Promise((resolve, rejects) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
    reader.on("error", () => {
      rejects("Error");
    });
  });

  const processedData = line.split(" (");

  if (processedData.length !== 0) {
    const LogDuration =
      (calculatable() - new Date(processedData[0])) / (1000 * 60 * 60 * 24);
    if (LogDuration >= LOGS_DURATION) {
      console.log(LOGFILE);
    await  FileSystem.unlink(LOGFILE, (err) => {
        console.log(err);
        return;
      });
      console.log("LOG File Removed");
    }
  } else {
    logStream.write(data + "\n");
  }
};

module.exports = { log_file };
