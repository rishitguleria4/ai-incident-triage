require("dotenv").config();
const { Worker } = require("bullmq");
const pool = require("./db");

const worker = new Worker(
  "incident-triage",
  async (job) => {
    const { incidentId, title, description } = job.data;

    console.log("Processing incident", incidentId);
    // real Phi-3 via Ollama
try {
  // mark processing
  await pool.query(
    "UPDATE incidents SET status='processing' WHERE id=$1",
    [incidentId]
  );

  const prompt = `
You are an incident triage assistant.
Return a single-paragraph summary in maximum 2 sentences.
No bullet points. No headings. No extra commentary.

Incident:
Title: ${title}
Description: ${description}
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "phi3:mini",
      prompt,
      stream: false
    })
  });

  const data = await response.json();
  const summary = data.response;

  await pool.query(
    "UPDATE incidents SET status='triaged', ai_summary=$1 WHERE id=$2",
    [summary, incidentId]
  );
} catch (err) {
  console.error(err);

  await pool.query(
    "UPDATE incidents SET status='failed' WHERE id=$1",
    [incidentId]
  );

  throw err;
}


    console.log("Done", incidentId);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

console.log("Worker started");
