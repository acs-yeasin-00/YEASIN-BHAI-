const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
  config: {
    name: "out",
    aliases: ["leave"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 2,
    shortDescription: "bot will leave gc",
    longDescription: "",
    category: "admin",
    guide: {
      vi: "{pn} [tid,blank]",
      en: "{pn} [tid,blank]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    let id;
    
    if (!args.join(" ")) {
      id = event.threadID;
    } else {
      const parsedId = parseInt(args.join(" "));
      id = parsedId;
    }

    return api.sendMessage(
      `▣ 𝐺𝑜𝑜𝑑 𝐵𝑦𝑒 👣 `.trim(),
      id, 
      () => api.removeUserFromGroup(api.getCurrentUserID(), id)
    );
  }
};
