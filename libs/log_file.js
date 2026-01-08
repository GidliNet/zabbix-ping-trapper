const FileSystem = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const LOGFILE = process.env.LOGFILE || "./logs/logs.log";

const log_file = async (data) => {
  if (!FileSystem.existsSync(LOGFILE)) {
    FileSystem.appendFileSync(LOGFILE, data + "\n", (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  } else {
    FileSystem.readFile(LOGFILE, "utf8", (err, fileData) => {
      if (err) {
        console.error("Error reading log file:", err);
        return;
      }
      const content = fileData.split("\n");
      const date = content[0].split("-")[0];
      if (Number((new Date() - new Date(date)) / (1000 * 60 * 60 * 24)) >= 5) {
        // Clear log file if older than 7 days
        FileSystem.writeFile(LOGFILE, data, (err) => {
          if (err) {
            console.error("Error clearing log file:", err);
          }
        });
      }
      FileSystem.appendFile(
        LOGFILE,
        data ? "\n" + data : "\n" + getCurrentTimestamp() + " Log entry",
        (err) => {
          if (err) {
            console.error("Error writing to log file:", err);
          }
        }
      );
    });
  }
};

module.exports = { log_file };
