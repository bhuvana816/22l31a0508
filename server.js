const express = require("express");
const { getToken, sendLog, loggingMiddleware } = require("./logger");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggingMiddleware);

app.get("/", (req, res) => {
  sendLog("backend", "info", "express", "Home route accessed ✅");
  res.send("Hello from Backend ✅");
});

app.get("/db", (req, res) => {
  sendLog("backend", "info", "database", "Fetched records from DB");
  res.send("Database log sent ✅");
});

app.get("/error", (req, res) => {
  sendLog("backend", "error", "handler", "Simulated error happened ❌");
  res.status(500).send("Error simulated ❌");
});

app.listen(PORT, async () => {
  await getToken();
  sendLog("backend", "info", "service", "🚀 Backend server started successfully");
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
