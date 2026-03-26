
# Use buildx platform variable to support multi-arch
FROM --platform=$BUILDPLATFORM node:20-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Create app directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git


# Install dependencies first (better cache)
COPY package*.json ./
RUN npm ci 

# Copy app source
COPY . .

# Set default environment variables (can be overridden)

ENV HOST='./Config/configuration.json'
ENV PACKETLOSS_INTERVAL="10"
ENV CRON="*/1 * * * * *"
#Day for log before it gets removed .
ENV LOGS_DURATION=5
#Logs location should be valid root directory and process should be able to create files / folder
ENV LOGDIR="./LOGSer"
# Zabbix trapper as JSON string


EXPOSE 10051 
EXPOSE 162


# Ensure node runs as PID 1 correctly
CMD ["node", "index.js"]
