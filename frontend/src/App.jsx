import { useEffect, useState } from "react";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidents, setIncidents] = useState([]);

  async function fetchIncidents() {
    const res = await fetch("http://localhost:4000/incidents", {
  headers: { "x-api-key": "secret123" },
});

    const data = await res.json();
    setIncidents(data);
  }

  async function submitIncident() {
    if (!title || !description) return;

    await fetch("http://localhost:4000/incidents", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  "x-api-key": "secret123",
},

      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    fetchIncidents();
  }

  useEffect(() => {
    fetchIncidents();
    const id = setInterval(fetchIncidents, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>AI Incident Triage</h2>

        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Incident title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            style={styles.textarea}
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button style={styles.button} onClick={submitIncident}>
            Submit Incident
          </button>
        </div>

        <div style={styles.list}>
  {incidents.map((i) => (
    <div key={i.id} style={styles.card}>
      <div style={styles.cardTitle}>{i.title}</div>

      <div style={styles.meta}>
        Status: <b>{i.status}</b>
      </div>

              <div style={styles.aiBox}>
                <div style={styles.aiLabel}>AI Summary</div>
                <div>{i.ai_summary || "Waiting for AI..."}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  meta: {
  marginTop: 6,
  color: "#666",
},

aiBox: {
  marginTop: 10,
  padding: 12,
  background: "#eef2ff",
  borderRadius: 6,
},

aiLabel: {
  fontSize: 12,
  fontWeight: "bold",
  marginBottom: 4,
  color: "#4338ca",
},

  global:{
    boxSizing: "border-box",
  },
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "system-ui",
  },

  container: {
    width: "100%",
    maxWidth: 700,
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  form: {
    background: "white",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    marginBottom: 30,
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    height: 100,
    padding: 20,
    marginBottom: 12,
    fontSize: 16,
    boxSizing: "border-box",
    resize: "vertical",
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 16,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  card: {
    background: "white",
    padding: 16,
    borderRadius: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  summary: {
    marginTop: 6,
    color: "#555",
  },
};

export default App;
