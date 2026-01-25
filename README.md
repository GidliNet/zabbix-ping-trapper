# Zabbix Ping Trapper

## Overview
**Zabbix Ping Trapper** is a lightweight Node.js service that monitors ping latency and packet loss for configured targets and sends the results to a Zabbix server using **Zabbix Trapper items**.

It is designed to be simple, flexible, and easy to deploy using Docker, while also supporting non-Docker execution for development or custom environments.

---

## Features
- Monitor ping latency for multiple targets
- Calculate and send packet loss metrics
- Send data to Zabbix using trapper items
- Configuration via environment variables
- Ready-to-use Docker image
- Cron-based execution schedule (seconds-level)

---

## Prerequisites
- Access to a Zabbix server
- Zabbix host with **Trapper items** already configured
- One of the following:
    - Docker (recommended)
    - Node.js (for non-Docker usage)

---

## Docker Deployment (Recommended)

### Prebuilt Docker Image
Official Docker image is available on Docker Hub:

**Docker Hub Repository**  
https://hub.docker.com/r/ejayztv/zabbix-ping-trapper

### Environment Variables
Create a `.env` file to configure the service:

```env
HOST1='[{"server":"<ZABBIX_SERVER_IP>","host":"<ZABBIX_HOST_NAME>","key":"Trapper.Ping"}]'
HOST2='[{"server":"<ZABBIX_SERVER_IP>","host":"<ZABBIX_HOST_NAME>","key":"Trapper.PacketLoss"}]'
PACKETLOSS_INTERVAL="60"
CRON="*/1 * * * * *"
IP1="8.8.8.8"
IP2="1.1.1.1"
```

**Notes:**
- Replace placeholders with your actual Zabbix configuration
- CRON uses seconds-level cron format
- Multiple IP targets can be added (IP3, IP4, etc.)
- Zabbix items must already exist and be of type Trapper

### Run the Container
```bash
docker run --env-file .env ejayztv/zabbix-ping-trapper:latest
```

### Build the Docker Image Yourself (Optional)

#### Clone the Repository
```bash
git clone https://github.com/Ejayz/zabbix-ping-trapper.git
cd zabbix-ping-trapper
```

#### Build Using Helper Script
```bash
bash DockerBuilder.sh <DOCKER_USER> <IMAGE_NAME> <BUILD_DIR> <IMAGE_TAG>
```

**Parameters:**
- `<DOCKER_USER>` – Docker Hub username
- `<IMAGE_NAME>` – Docker image name
- `<BUILD_DIR>` – Directory containing the Dockerfile
- `<IMAGE_TAG>` – Image version (e.g., v1.0.0)

---

## Running Without Docker

### Requirements
- Node.js (LTS recommended)
- npm
- Access to a Zabbix server

### Install Dependencies
```bash
git clone https://github.com/Ejayz/zabbix-ping-trapper.git
cd zabbix-ping-trapper
npm install
```

### Configure Environment
Create a `.env` file in the project root:

```env
HOST1='[{"server":"<ZABBIX_SERVER_IP>","host":"<ZABBIX_HOST_NAME>","key":"Trapper.Ping"}]'
HOST2='[{"server":"<ZABBIX_SERVER_IP>","host":"<ZABBIX_HOST_NAME>","key":"Trapper.PacketLoss"}]'
PACKETLOSS_INTERVAL="60"
CRON="*/1 * * * * *"
IP1="8.8.8.8"
IP2="1.1.1.1"
```

### Run the Application
```bash
node index.js
```

---

## How It Works
1. Pings configured IP targets
2. Calculates latency and packet loss
3. Sends metrics to Zabbix using trapper items
4. Executes based on the configured cron schedule

---

## Dependencies

This project uses the following open-source packages:

- **cron** (^4.4.0) – Cron scheduling with seconds support
- **dotenv** (^17.2.3) – Environment variable loader
- **net-ping** (^1.2.4) – ICMP ping for latency and reachability
- **zabbix-promise** (^2.0.2) – Promise-based Zabbix trapper sender


---

## License
ISC License

---

## Contributing
Issues, feature requests, and pull requests are welcome.

---

## Acknowledgments
- Node.js
- Zabbix
- Docker


---

