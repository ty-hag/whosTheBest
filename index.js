/*

Discord bot to keep track of who is the best

*/

// db testing

const db = require('./modules/database');

const test = async () => {
  console.log('Testing update function.')
  // await db.changeCurrentBest('Croddler');
  const output = await db.checkCurrentBest();
  console.log(output);
  await db.disconnect();
  console.log('Testing complete.')
}

test();

// discord testing

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

const bestRegex = /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/;

client.on('message', message => {
	if (bestRegex.test(message.content)) {
    console.log(message.content);
    const match = bestRegex.exec(message.content);
    console.log(match);
    message.channel.send(`${match[2]} has been declared the best!`);
  }
});

client.login(process.env.DISCORD_TOKEN);