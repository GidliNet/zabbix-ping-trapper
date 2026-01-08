const { getCurrentTimestamp } = require("./timestamp");
const zabbix = require("zabbix-promise");

const PostPing = async (IP, ZABBIX_HOST, ZABBIX_KEY, ZABBIX_SERVER, data) => {
  try {
    const result = await zabbix.sender({
      server: ZABBIX_SERVER,
      host: ZABBIX_HOST,
      key: ZABBIX_KEY,
      value: data,
    });
    console.log(
      getCurrentTimestamp() +
        `${IP} Ping Trapper was sent with ` +
        data +
        ` ms value.`
    );
  } catch (error) {
    console.log(
      getCurrentTimestamp() + `${IP} Ping Trapper encountered an error:` + error
    );
  }
};

const PostPacketloss = async (IP, ZABBIX_HOST, ZABBIX_KEY, ZABBIX_SERVER, data) => {
  try {
     await zabbix.sender({
      server: ZABBIX_SERVER,
      host: ZABBIX_HOST,
      key: ZABBIX_KEY,
      value: data,
    });
   
    console.log(
      getCurrentTimestamp() +
        `${IP} Packetloss Trapper was sent with ` +
        data +
        ` % value.`
    );
  } catch (error) {
    console.log(
      getCurrentTimestamp() +
        `${IP} Packetloss Trapper encountered an error:` +
        error
    );
  }
};
module.exports = { PostPing, PostPacketloss };
