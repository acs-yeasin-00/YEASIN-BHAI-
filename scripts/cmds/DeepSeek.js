const axios = require("axios");

const API_URL = "https://xsaim8x-xxx-api.onrender.com/api/deepseek?ask=";

module.exports.config = {
  name: "deepseek",
  version: "1.0.0",
  role: 0,
  author: "Saimx69x",
  description: "DeepSeek AI chat with conversation history",
  usePrefix: true,
  aliases: ["ds"],
  guide: "[message]",
  category: "ai",
  coolDowns: 5,
};

const conversationHistory = new Map();

function getConversationHistory(uid) {
  if (!conversationHistory.has(uid)) conversationHistory.set(uid, []);
  return conversationHistory.get(uid);
}

function updateConversation(uid, role, text) {
  const history = getConversationHistory(uid);
  history.push({ role, text });
  if (history.length > 20) history.shift();
}

function buildPrompt(history) {
  return history.map(e => `${e.role === "user" ? "User" : "AI"}: ${e.text}`).join("\n") + "\nAI:";
}

async function fetchDeepSeekResponse(prompt) {
  try {
    const res = await axios.get(API_URL + encodeURIComponent(prompt));
    if (res.data && typeof res.data.response === "string") return res.data.response.trim();
    return "⚠️ DeepSeek API didn't return a valid response.";
  } catch (err) {
    console.error("DeepSeek API Error:", err.message);
    return "❌ Error: DeepSeek API failed to respond.";
  }
}

module.exports.onStart = async function ({ api, event, args }) {
  const uid = event.senderID;
  const input = args.join(" ");
  if (!input) return api.sendMessage("📝 | Please enter a message for DeepSeek.", event.threadID, event.messageID);

  updateConversation(uid, "user", input);
  const prompt = buildPrompt(getConversationHistory(uid));

  const reply = await fetchDeepSeekResponse(prompt);
  updateConversation(uid, "ai", reply);

  const styledReply =
    `💬 | 𝙳𝚎𝚎𝚙𝚂𝚎𝚎𝚔\n` +
    `・───────────・\n` +
    `${reply}\n` +
    `・──── >ᴗ< ────・`;

  await api.sendMessage(
    styledReply,
    event.threadID,
    (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: uid,
        });
      }
    },
    event.messageID
  );
};

module.exports.onReply = async function ({ api, event, Reply }) {
  const uid = event.senderID;
  if (Reply.author !== uid) return;

  const input = event.body;
  updateConversation(uid, "user", input);

  const prompt = buildPrompt(getConversationHistory(uid));
  const reply = await fetchDeepSeekResponse(prompt);
  updateConversation(uid, "ai", reply);

  const styledReply =
    `💬 | 𝙳𝚎𝚎𝚙𝚂𝚎𝚎𝚔\n` +
    `・───────────・\n` +
    `${reply}\n` +
    `・──── >ᴗ< ────・`;

  await api.sendMessage(
    styledReply,
    event.threadID,
    (err, info) => {
      if (!err) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: uid,
        });
      }
    },
    event.messageID
  );
};
