const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (msg.content === 'ping') {
        await msg.reply('Pong!');
    }
});

await client.login(config.BOT_TOKEN);
