const fs = require("fs-extra");
const { utils } = global;

const OWNER_FB = "https://www.facebook.com/profile.php?id=61583519825289";

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "Yeasin 👑",
		countDown: 5,
		role: 0,
		description: "Show or change bot prefix",
		category: "config",
		guide: {
			en: "{pn} <new prefix>: change bot prefix\n{pn} reset: reset to default"
		}
	},

	langs: {
		en: {
			reset: "Your prefix has been reset to default: %1",
			onlyAdmin: "Only admin can change global prefix",
			confirmGlobal: "React to confirm changing global prefix 👑",
			confirmThisThread: "React to confirm changing chat prefix 👑",
			successGlobal: "👑 Global prefix changed to: %1",
			successThisThread: "👑 Prefix in your chat changed to: %1",
			myPrefix: "🌐 Global prefix: %1\n🛸 Group prefix: %2"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0])
			return message.SyntaxError();

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(getLang("reset", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g")
			if (role < 2)
				return message.reply(getLang("onlyAdmin"));
			else
				formSet.setGlobal = true;
		else
			formSet.setGlobal = false;

		return message.reply(args[1] === "-g" ? getLang("confirmGlobal") : getLang("confirmThisThread"), (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message, getLang }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const infoText = getLang("myPrefix", global.GoatBot.config.prefix, utils.getPrefix(event.threadID));
			const replyText = `${infoText}\n\n💫 𝑂𝑊𝑁𝐸𝑅: ${OWNER_FB}`;
			return message.reply(replyText);
		}
	}
};
