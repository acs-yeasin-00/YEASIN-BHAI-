const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "autodown",
    aliases: ["autodl"],
    version: "1.6.9",
    author: "Nazrul",
    role: 0,
    description: "Auto-download media from any platform",
    category: "media",
    guide: { en: "Send any media link" }
  },

  onStart: async function({}) {},

  onChat: async function({ api, event }) {
    const url = event.body?.match(/https?:\/\/[^\s]+/)?.[0];
    if (!url) return;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiBase = (await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json")).data.api;

      const endpoints = [
        `${apiBase}/nazrul/alldlxx?url=${encodeURIComponent(url)}`,
        `https://www.noobs-apis.run.place/nazrul/alldl2?url=${encodeURIComponent(url)}`
      ];

      let data = null;

      for (let endpoint of endpoints) {
        try {
          const res = await axios.get(endpoint);
          if (res.data?.url) {
            data = res.data;
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (!data || !data.url) throw new Error("Download link not found from both sources.");
      const platform = data.p || detectPlatform(url);
      const filePath = path.join(__dirname, `n_${Date.now()}.mp4`);
      const writer = fs.createWriteStream(filePath);

      const response = await axios({
        url: data.url,
        method: 'GET',
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*',
          'Connection': 'keep-alive'
        }
      });

      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await api.sendMessage({
        body: `\n${data.t || `✅ Here's your downloaded video!`}\n🛠️ Platform: ${platform}\n`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID);

      fs.unlink(filePath, () => {});
      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (e) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      console.log("❌ Download error:", e.message);
    }
  }
};

function detectPlatform(url) {
  if (/youtube\.com|youtu\.be/i.test(url)) return "YouTube";
  if (/tiktok\.com/i.test(url)) return "TikTok";
  if (/facebook\.com|fb\.watch/i.test(url)) return "Facebook";
  if (/instagram\.com/i.test(url)) return "Instagram";
  if (/x\.com|twitter\.com/i.test(url)) return "Twitter/X";
  if (/threads\.net/i.test(url)) return "Threads";
  if (/pinterest\.com/i.test(url)) return "Pinterest";
  return "Unknown";
}
