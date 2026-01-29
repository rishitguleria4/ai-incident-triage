require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./auth");

const pool = require("./db");
const queue = require("./queue");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/incidents",auth, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description required" });
  }

  const result = await pool.query(
    "INSERT INTO incidents (title, description, status) VALUES ($1,$2,'submitted') RETURNING *",
    [title, description]
  );

  const incident = result.rows[0];

  await queue.add(
  "triage",
  {
    incidentId: incident.id,
    title,
    description,
  },
  {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  }
);


  res.json(incident);
});

app.get("/incidents", auth ,async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM incidents ORDER BY id DESC"
  );
  res.json(result.rows);
});

app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});
app.get("/", (req, res) => {
  res.send("AI Incident API Running");
});
