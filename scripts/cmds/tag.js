const cfg = {
  name: "tag",
  version: "2.0",
  author: "ArYAN",
  countDown: 0,
  role: 0,
  description: "Tag a user",
  category: "social",
  guide: { en: "{p}{n} [reply/mention] <text>" }
};

async function onStart({ api, event, args }) {
  try {
    const a = event.messageReply?.senderID || args[0] || event.senderID;
    const b = await api.getUserInfo(a);
    if (!b || !b[a]) return api.sendMessage("⚠️ Reply or mention someone to tag.", event.threadID, event.messageID);

    const c = b[a].name;
    const d = args.join(" ") || "";
    api.sendMessage(
      {
        body: `${c} ${d}`,
        mentions: [{ tag: c, id: a }]
      },
      event.threadID,
      event.messageID
    );
  } catch (e) {
    api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
  }
}

module.exports = {
  config: cfg,
  onStart
};
