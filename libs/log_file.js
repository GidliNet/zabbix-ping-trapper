const FileSystem = require("fs/promises");
const FileSystemNonPromise = require("fs");
const dotenv = require("dotenv");
const { getCurrentTimeStamp, calculatable } = require("./timestamp");
const { DateTime } = require("luxon");
dotenv.config();

const LOGFILE = process.env.LOGFILE || "./logs/logs.log";
const LOGDIR = process.env.LOGDIR || "./logs";
const LOGS_DURATION = process.env.LOGS_DURATION;
const readline = require("readline");
let logStream;
const log_file = async (data) => {
  const isDirectoryValid = await validDirectory();
  const isValidLogFile = await validLogFile();
  const LogCleaner = await LogsCleaner();
  if (!LogCleaner) {
    await validLogFile();
    setTimeout(async () => {}, 500);
  }
  const LogWriters = await LogsWriter(data);
};

const validDirectory = async () => {
  try {
    console.log("Exected");
    const checkValidDirectory = await FileSystem.access("./logs");
    console.log("Valid:", checkValidDirectory);
    if (!checkValidDirectory) {
      await FileSystem.mkdir("./logs", { recursive: true });
      console.log("Created logs folder on directory.");
      return false;
    } else {
      return true;
    }
  } catch (e) {
    await FileSystem.mkdir("./logs", { recursive: true });
    console.log("Created logs folder on directory.");
  }
};

const validLogFile = async () => {
  try {
    if (await FileSystem.access(LOGFILE)) {
      await FileSystem.writeFile(
        LOGFILE,
        `{"LogFile":{LogStartDate:"${DateTime.now()}"}}\n`,
        "utf-8",
      );
      console.log("Created Log File.");
      return false;
    } else {
      return true;
    }
  } catch (e) {
    await FileSystem.writeFile(
      LOGFILE,
      `{"LogFile":{"LogStartDate":"${DateTime.now()}"}}
`,
    );
  }
};

const LogsCleaner = async () => {
  const ReadLog = await FileSystemNonPromise.createReadStream(LOGFILE);
  const reader = readline.createInterface({ input: ReadLog });

  const line = await new Promise((resolve, rejects) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
    reader.on("error", () => {
      rejects("Error");
    });
  });
  ReadLog.close();

  const LogDate = DateTime.fromISO(JSON.parse(line).LogFile.LogStartDate);
  const TimeStamp = DateTime.now();
  const timeDiff = TimeStamp.diff(LogDate, "days").days;
  if (timeDiff >= LOGS_DURATION) {
    await FileSystem.unlink(LOGFILE);
    return false;
  } else {
    return true;
  }
};

const LogsWriter = async (data) => {
  const logStream = FileSystemNonPromise.createWriteStream(LOGFILE, {
    flags: "a",
  });
  logStream.on("data", (data) => {
    console.log(data);
  });
  logStream.write(data + "\n");
  logStream.end();
};

module.exports = { log_file };
