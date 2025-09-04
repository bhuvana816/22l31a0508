const axios = require('axios');

async function register() {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email: "bhuvanass2005@gmail.com",   // put your email
      name: "Bhuvana Sree Sahithi",           // your name
      mobileNo: "6281941608",        // your number
      githubUsername: "bhuvana816",      // just username, not full link
      rollNo: "22L31A0508",               // your roll no
      accessCode: "YzuJeU" ,
      clientID: '529a1d32-3881-4d4f-a808-686f5d76626e',
      clientSecret: 'JPRVsSxjHvPkzZtT'        // use the one from mail, not example
    });

    console.log("✅ Success:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ Error:", error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

register();
