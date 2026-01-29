const { Queue } = require("bullmq");

const queue = new Queue("incident-triage", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

module.exports = queue;
