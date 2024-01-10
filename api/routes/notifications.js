const router = require("express").Router();
const { sendPushNotification, saveToken } = require("../pushNotifications");
router.post("/send-notification", async (req, res) => {
  try {
    const { topic, title, body } = req.body;
    await sendPushNotification(topic, title, body);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending push notification:", error);
    res.status(500).json({ error: "Failed to send push notification" });
  }
});
router.post("/save-token", async (req, res) => {
  try {
    const { token } = req.body;
    await saveToken(token);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving token:", error);
    res.status(500).json({ error: "Failed to save token" });
  }
});
module.exports = router;
