const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("C:/Users/barho/Downloads/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize an empty array to store tokens
const registrationTokens = [
  "fZPnIpooDu-gOXxphB4T2R:APA91bHpXEOsL5XfYIQ1ikmeOB_r-XXABhmR6m7tJiQXVDXMV-ahJ6p-c9O6AMsf9TBGkErnsfsH1uDe916Zpq2_F38FyyoVPi5A8X49ev_xlzyhzUh8QK6St2joa4vMlRwXNfKFVMsh",
  "dBGf0aLwaJsU2rG2lOiYSu:APA91bFszptWSzEurSuMXk0eUiB5FXMlTgpPZ6k_cL1Q1z2chAPbXGMRn44htf9BBJENphye_IPEjRD3nBL0rPpeYXTPv210e1ns60JSPzc6HYZsJu0HFoflL8reYfDocPWoaXJ45pUs",
];

// Function to save token to the in-memory array
async function saveToken(token) {
  if (!registrationTokens.includes(token)) {
    registrationTokens.push(token);
    console.log("Token saved:", token);
    await subscribeAllUsersToTopic(); // Trigger the subscription function here
  }
}

// Subscribe all users to the "all_users" topic
async function subscribeAllUsersToTopic() {
  try {
    // Note: The registrationTokens array is now defined in the outer scope
    const response = await admin
      .messaging()
      .subscribeToTopic(registrationTokens, "all_users");
    console.log(
      "Successfully subscribed all users to 'all_users' topic:",
      response
    );
  } catch (error) {
    console.log("Error subscribing users to topic:", error);
  }
}

//creating code of topic is missing
async function sendPushNotification(topic, title, body) {
  const message = {
    topic: topic,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Successfully sent push notification:", response);
  } catch (error) {
    console.log("Error sending push notification:", error);
  }
}

module.exports = { sendPushNotification, subscribeAllUsersToTopic, saveToken };
