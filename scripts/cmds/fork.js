module.exports = {
  config: {
    name: "fork",
    version: "1.0.0",
    author: "Hinata",
    role: 2, // 0 = all, 1 = group admin, 2 = bot admin
    shortDescription: "Send GitHub repo link",
    longDescription: "Sends your GitHub repository link",
    category: "other",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function({ api, event }) {
    if (event.senderID !== "100003608645652") {
      return api.sendMessage("❌ You don’t have permission to use this command.", event.threadID, event.messageID);
    }

    return api.sendMessage(
      "🔗 GitHub Repo Link:\n\nhttps://github.com/Butterfly002-1/Boss-Yeasin.git",
      event.threadID,
      event.messageID
    );
  }
};
