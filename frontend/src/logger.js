import axios from "axios";

const CLIENT_ID = "529a1d32-3881-4d4f-a808-686f5d76626e";
const CLIENT_SECRET = "JPRVsSxjHvPkzZtT";

const USER_EMAIL = "bhuvanass2005@gmail.com";
const USER_NAME = "Bhuvana Sree Sahithi";
const USER_ROLLNO = "22L31A0508";
const USER_ACCESSCODE = "YzuJeU";

let token = null;

// ✅ Allowed frontend packages
const validFrontend = ["api", "component", "hook", "page", "util"];

export async function getToken() {
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
    console.log("✅ Frontend token fetched");
    return token;
  } catch (error) {
    console.error("❌ Failed to get token:", error.response?.data || error.message);
    return null;
  }
}

export async function FrontendLog(level, packageName, message) {
  if (!token) {
    await getToken();
    if (!token) return;
  }

  if (!validFrontend.includes(packageName)) {
    console.error(`❌ Invalid package '${packageName}' for frontend`);
    return;
  }

  try {
    const response = await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      {
        stack: "frontend",
        level,
        package: packageName,
        message,
        timestamp: new Date().toISOString()
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log("✅ Frontend log sent:", response.data);
  } catch (error) {
    console.error("❌ Frontend logging failed:", error.response?.data || error.message);
  }
}
