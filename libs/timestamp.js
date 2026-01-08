function getCurrentTimestamp() {
  const now = new Date();
  const timestamp = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(now);

  return timestamp;
}

function calculatable() {
  return new Date();
}

module.exports = { getCurrentTimestamp,calculatable };
