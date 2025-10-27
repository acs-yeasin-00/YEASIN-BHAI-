const a = require("axios");
const b = require("fs-extra");

async function onStart({ api, event, message }) {
  try {
    const c = event.messageReply?.attachments?.[0];
    if (!c) return message.reply("⚠️ Reply to a video to convert it.");
    if (c.type !== "video") return message.reply("❌ Only video files are supported.");

    const d = (await a.get(c.url, { responseType: "arraybuffer" })).data;
    const e = __dirname + "/cache/v2a.m4a";

    if (!b.existsSync(__dirname + "/cache")) b.mkdirSync(__dirname + "/cache");
    b.writeFileSync(e, Buffer.from(d));

    api.sendMessage({ attachment: b.createReadStream(e) }, event.threadID, event.messageID);
  } catch (f) {
    message.reply("❌ Error: " + f.message);
  }
}

module.exports = {
  config: {
    name: "v2a",
    aliases: ["video2audio", "mp3"],
    version: "2.0",
    author: "ArYAN",
    countDown: 15,
    role: 0,
    description: "Convert a replied video to audio",
    category: "media",
    guide: { en: "{p}{n}" }
  },
  onStart
};
