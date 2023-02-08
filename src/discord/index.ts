import AiOSLog from "@/utils/log";
const {
	Client,
	Events,
	GatewayIntentBits,
	ActivityType,
} = require("discord.js");
const dcClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

const Mashiro_discord_Core = (token) => {
	// 起動log
	dcClient.once("ready", async () => {
		AiOSLog(`Logged in Discord! Welcome, ${dcClient.user.tag}!`);
		dcClient.user.setActivity("Misskey(mi.mashiro.site)", {
			type: ActivityType.Watching,
		});

		await dcClient.application.commands.set(commandData, "768808039595507722");
	});

	// メッセージから自動反応
	dcClient.on("messageCreate", (message) => {
		if (message.author.bot) return;

		if (~message.content.indexOf("ましろ")) {
			message.reply("呼びました？");
		}
	});

	// スラッシュコマンド
	dcClient.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		if (interaction.commandName === "ping") {
			await interaction.reply(`:ping_pong: ${dcClient.ws.ping}ms`);
		}
	});

	dcClient.login(token);
};

export default Mashiro_discord_Core;

const commandData = [
	{
		name: "ping",
		description: "ましろとDiscordのレイテンシをチェックします。",
	},
];
