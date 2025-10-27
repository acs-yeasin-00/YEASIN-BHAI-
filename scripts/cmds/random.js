const a = require("axios");
const b = require("fs");
const c = require("path");
const d = require("https");

const nix = "https://nix-random-api.vercel.app/api/video/mixvideo";

module.exports.config = {
  name: "random",
  version: "1.0",
  role: 0,
  author: "ArYAN",
  description: "Send a random video from API",
  category: "media",
  cooldowns: 5
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;
  try {
    const e = await a.get(nix);
    const f = e.data;

    if (!f || !f.url || !f.url.url) {
      return api.sendMessage("[⚜️]➜ error random api.", threadID, messageID);
    }

    const g = f.url.url;
    const h = f.url.name;
    const i = f.cp;
    const j = f.length;

    const k = c.join(__dirname, "cache");
    if (!b.existsSync(k)) b.mkdirSync(k);

    const l = c.join(k, `rndm_${Date.now()}.mp4`);
    const m = b.createWriteStream(l);

    const n = new Promise((resolve, reject) => {
      d.get(g, (o) => {
        if (o.statusCode !== 200) {
          m.end();
          b.unlink(l, () => {});
          return reject(new Error(`Download failed with status code ${o.statusCode}`));
        }
        o.pipe(m);
        m.on("finish", () => resolve());
      }).on("error", (p) => {
        m.end();
        b.unlink(l, () => {});
        reject(p);
      });
    });

    await n;

    const q = `${i}\n\n𝐓𝐨𝐭𝐚𝐥 𝐕𝐢𝐝𝐞𝐨𝐬: [${j}]\n𝐀𝐝𝐝𝐞𝐝 𝐓𝐡𝐢𝐬 𝐕𝐢𝐝𝐞𝐨 𝐓𝐨 𝐓𝐡𝐞 𝐀𝐩𝐢 𝐁𝐲 [${h}]`;

    return api.sendMessage({
      body: q,
      attachment: b.createReadStream(l)
    }, threadID, () => {
      b.unlinkSync(l);
    }, messageID);

  } catch (r) {
    console.error(r);
    return api.sendMessage("[⚜️]➜ Failed to fetch video. Please try again later.", threadID, messageID);
  }
};
