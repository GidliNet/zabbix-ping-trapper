const ping = require("net-ping");
const cron = require("cron");
const zabbix = require("zabbix-promise");
const dotenv = require("dotenv");
dotenv.config();

const IP = process.env.IP.split(",") || "1.1.1.1";
const CRON = process.env.CRON || "*/1 * * * * *";
const PACKETLOSS_COUNT = Number(process.env.PACKETLOSS_COUNT) || 60;
const ZABBIX_TRAPPER = JSON.parse(process.env.ZABBIX_TRAPPER) || [
  {
    server: "172.16.4.150",
    host: "172.16.4.139",
    key: "Trapper.Ping1",
  },
  {
    server: "172.16.4.150",
    host: "172.16.4.139",
    key: "Trapper.PacketLoss1",
  },
  {
    server: "172.16.4.150",
    host: "172.16.4.139",
    key: "Trapper.Ping2",
  },
  {
    server: "172.16.4.150",
    host: "172.16.4.139",
    key: "Trapper.PacketLoss2",
  },
];

if (IP.length !== 2 || ZABBIX_TRAPPER.length !== 4) {
  console.log("Exitting, Thus not met the required number of paramter for ZABBIX TRAPPER and IP");
  return 0;
}

const session = ping.createSession({
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 16,
  retries: 1,
  sessionId: process.pid % 65535,
  timeout: 2000,
  ttl: 128,
});


let pingCount = 0;
let pingFailed = 0;
let totalTime = 0;


let pingCount1 = 0;
let pingFailed1 = 0;
let totalTime1 = 0;
cron.CronJob.from({
  cronTime: CRON,
  onTick: function () {
    session.pingHost(IP[0], function (error, target, sent, rcvd) {
      console.log(error, target, sent, rcvd);
      Ping(rcvd - sent);
      if (error) {
        pingFailed++;
      } else {
        pingCount++;
      }
      totalTime++;

      if (totalTime == PACKETLOSS_COUNT) {
        const percentage = (pingFailed / totalTime) * 100;
        PacketLoss(`${percentage}`);
        pingCount = 0;
        pingFailed = 0;
        totalTime = 0;
      }
    });
  },
  start: true,
});



cron.CronJob.from({
  cronTime: CRON,
  onTick: function () {
    session.pingHost(IP[1], function (error, target, sent, rcvd) {
      console.log(error, target, sent, rcvd);
      SecondPing(rcvd - sent);
      if (error) {
        pingFailed1++;
      } else {
        pingCount1++;
      }
      totalTime1++;

      if (totalTime1 == PACKETLOSS_COUNT) {
        const percentage = (pingFailed1 / totalTime1) * 100;
        SecondPacketLoss(`${percentage}`);
        pingCount1 = 0;
        pingFailed1 = 0;
        totalTime1 = 0;
      }
    });
  },
  start: true,
});

const Ping = async (data) => {
  try {
    const result = await zabbix.sender({
      server: ZABBIX_TRAPPER[0].server,
      host: ZABBIX_TRAPPER[0].host,
      key: ZABBIX_TRAPPER[0].key,
      value: data,
    });
    console.log("Ping Trapper was sent");
  } catch (error) {
    console.log("Ping Trapper encountered an error:" + error);
  }
};
const PacketLoss = async (data) => {
  try {
    const result = await zabbix.sender({
      server: ZABBIX_TRAPPER[1].server,
      host: ZABBIX_TRAPPER[1].host,
      key: ZABBIX_TRAPPER[1].key,
      value: data,
    });
    console.log("Packetloss Trapper was sent");
  } catch (error) {
    console.log("Packetloss encountered an error:" + error);
  }
};
const SecondPing = async (data) => {
  try {
    const result = await zabbix.sender({
      server: ZABBIX_TRAPPER[2].server,
      host: ZABBIX_TRAPPER[2].host,
      key: ZABBIX_TRAPPER[2].key,
      value: data,
    });
    console.log("Ping Trapper was sent");
  } catch (error) {
    console.log("Ping Trapper encountered an error:" + error);
  }
};
const SecondPacketLoss = async (data) => {
  try {
    const result = await zabbix.sender({
      server: ZABBIX_TRAPPER[3].server,
      host: ZABBIX_TRAPPER[3].host,
      key: ZABBIX_TRAPPER[3].key,
      value: data,
    });
    console.log("Packetloss Trapper was sent");
  } catch (error) {
    console.log("Packetloss encountered an error:" + error);
  }
};
