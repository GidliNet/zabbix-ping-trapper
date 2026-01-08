const dotenv = require("dotenv");
const { Process } = require("./libs/TrapperMainFunc");
const FileSystem = require("fs");
const { start } = require("repl");
dotenv.config();

//Cron job interval
const CRON = process.env.CRON || "*/1 * * * * *";
//Interval when to send packetloss data to trapper.
const PACKETLOSS_INTERVAL = Number(process.env.PACKETLOSS_INTERVAL) || 60;
//Object array information of trapper
const HOST = process.env.HOST || "./Config/configuration.json";
let pingCount = 0;
let pingFailed = 0;
let totalTime = 0;

let config = [];

try {
  FileSystem.open(HOST, "r", (err, fd) => {
    if (err) {
      console.log("Error opening configuration file:", err);
      return;
    }
    FileSystem.readFile(fd, "utf8", (err, data) => {
      if (err) {
        console.log("Error reading configuration file:", err);
        return;
      }

      JSON.parse(data).forEach((host) => {
        Process(
          host.IP,
          PACKETLOSS_INTERVAL,
          host.TrapperPing.server,
          host.TrapperPing.host,
          host.TrapperPing.key,
          host.TrapperPacketloss.server,
          host.TrapperPacketloss.key,
          host.TrapperPacketloss.host,
          host.PING_TIMEOUT,
          host.RETRIES,
          CRON
        );
      });
    });
  });

  if (config.length > 0) {
    throw new Error("Configuration file is empty.");
  }
} catch (error) {
  console.error("Error loading configuration file:", error);
}
