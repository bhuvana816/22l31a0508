const axios = require("axios");

// 🔑 Credentials
const CLIENT_ID = "529a1d32-3881-4d4f-a808-686f5d76626e";
const CLIENT_SECRET = "JPRVsSxjHvPkzZtT";

// 🔑 User info
const USER_EMAIL = "bhuvanass2005@gmail.com";
const USER_NAME = "Bhuvana Sree Sahithi";
const USER_ROLLNO = "22L31A0508";
const USER_ACCESSCODE = "YzuJeU";

let token = null;

// ✅ Allowed packages
const validBackend = ["database", "handler", "service", "express", "validation"];

/**
 * Fetch access token
 */
async function getToken() {
  try {
    const response = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: USER_EMAIL,
      name: USER_NAME,
      rollNo: USER_ROLLNO,
      accessCode: USER_ACCESSCODE,
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });

    token = response.data.access_token;
    console.log("✅ Token fetched successfully");
    return token;
  } catch (error) {
    console.error("❌ Failed to get token:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Send log
 */
async function sendLog(stack, level, packageName, message) {
  if (!token) {
    await getToken();
    if (!token) return;
  }

  if (stack === "backend" && !validBackend.includes(packageName)) {
    console.error(`❌ Invalid package '${packageName}' for backend`);
    return;
  }

  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    console.log("✅ Log sent:", response.data);
  } catch (error) {
    console.error("❌ Logging failed:", error.response?.data || error.message);
  }
}

/**
 * Express middleware
 */
function loggingMiddleware(req, res, next) {
  sendLog("backend", "info", "express", `Request: ${req.method} ${req.url}`);
  next();
}

module.exports = { getToken, sendLog, loggingMiddleware };
