const fs = require("fs-extra");
const axios = require("axios");
const request = require("request");

module.exports = {
  config: {
    name: "autodll",
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: "Always active auto video download for any URL",
    category: "media"
  },

  onStart: async function ({ api, event }) {
    return api.sendMessage("✅ AutoLink Is running.", event.threadID);
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const message = event.body;
    const linkMatch = message.match(/(https?:\/\/[^\s]+)/);
    if (!linkMatch) return;

    const url = linkMatch[0];
    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const response = await axios.get(
        `https://apis-toop.vercel.app/aryan/alldl?url=${encodeURIComponent(url)}`
      );
      const data = response.data || {};
      const downloadUrl = data.downloadUrl || null;
      const imageUrl = data.imageUrl || null;

      if (!downloadUrl && !imageUrl) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("❌ Failed to download content. The URL might not be supported.", threadID, event.messageID);
      }

      if (downloadUrl) {
        const fileName = `download.mp4`;
        request(downloadUrl)
          .pipe(fs.createWriteStream(fileName))
          .on("close", () => {
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(
              {
                body: "════『 AUTODL 』════\n\n✨ Here's your video! ✨",
                attachment: fs.createReadStream(fileName)
              },
              threadID,
              () => fs.unlinkSync(fileName)
            );
          });
      } else if (imageUrl) {
        const fileName = `download.jpg`;
        request(imageUrl)
          .pipe(fs.createWriteStream(fileName))
          .on("close", () => {
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(
              {
                body: "════『 AUTODL 』════\n\n✨ Here's your image! ✨",
                attachment: fs.createReadStream(fileName)
              },
              threadID,
              () => fs.unlinkSync(fileName)
            );
          });
      }
    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("❌ Failed to download content. An error occurred.", threadID, event.messageID);
      console.error(err);
    }
  }
};
