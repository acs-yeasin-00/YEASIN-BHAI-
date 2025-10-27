const a = require('axios');

module.exports = {
  config: {
    name: "flux",
    aliases: [],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Generate image using Flux API"
    },
    longDescription: {
      en: "Send a prompt to the Flux API and get back an image."
    },
    category: "ai",
    guide: {
      en: "{pn} [prompt text]"
    }
  },

  onStart: async function ({ api, event, args }) {
    const p = args.join(" ");
    if (!p) {
      return api.sendMessage(
        "❌ Please provide a prompt.\nExample: flux cyberpunk city",
        event.threadID,
        event.messageID
      );
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const u = `http://65.109.80.126:20409/aryan/flux?prompt=${encodeURIComponent(p)}`;

    try {
      const r = await a.get(u, { responseType: 'stream' });

      await api.sendMessage({
        body: `✅ Here is your Flux AI image!\n\n📝 Prompt: ${p}`,
        attachment: r.data
      }, event.threadID, null, event.messageID);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (e) {
      console.error("Flux API Error:", e.message || e);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("⚠ Flux API theke image generate kora jacchhe na.", event.threadID, event.messageID);
    }
  }
};
