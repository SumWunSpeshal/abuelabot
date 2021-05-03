const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();

const executeCommand = async ({msg, command, args}) => {
  let resp = '';

  switch (command) {
    case 'hello':
      resp = 'world';
      break;

    case 'ping':
      resp = 'pong';
      break;

    case 'what':
      resp = '...ever';
      break;
    default: return;
  }

  await msg.reply(resp);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }

  if (!msg.content.startsWith(config.PREFIX)) {
    return;
  }

  const command = msg.content.substr(1).toLowerCase();
  const args = msg.content.split(' ').shift();

  await executeCommand({msg, command, args});
});

client.login(config.BOT_TOKEN);
