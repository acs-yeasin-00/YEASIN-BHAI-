async function onStart({ event, message, args, usersData }) {
  const a = async (id) => await usersData.getAvatarUrl(id);
  let b, c;

  try {
    if (event.type === "message_reply") {
      c = event.messageReply.senderID;
    } else if (args.length && args.join(" ").includes("facebook.com")) {
      const d = args.join(" ").match(/(\d+)/);
      if (!d) throw new Error("❌ Invalid Facebook URL");
      c = d[0];
    } else if (Object.keys(event.mentions).length) {
      c = Object.keys(event.mentions)[0];
    } else {
      c = event.senderID;
    }

    b = await a(c);
    const e = await global.utils.getStreamFromURL(b);
    message.reply({ attachment: e });
  } catch (f) {
    message.reply(`⚠️ Failed: ${f.message}`);
  }
}

module.exports = {
  config: {
    name: "pp",
    aliases: ["profilepic", "dp"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    description: "Fetch user profile picture",
    category: "media",
    guide: { en: "{pn} @mention | userID | reply | Facebook URL" }
  },
  onStart
};
