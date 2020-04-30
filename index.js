/*

Discord bot to keep track of who is the best

*/

// db testing

const db = require('./modules/database');
const handlers = require('./modules/handlers');

// const test = async () => {
//   console.log('Testing update function.')
//   // await db.changeCurrentBest('Croddler');
//   const output = await db.checkCurrentBest();
//   console.log(output);
//   await db.disconnect();
//   console.log('Testing complete.')
// }

// test();

// discord testing

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

const newBestRegex = /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/i;
const checkBestRegex = /(who's|who|who is) (the|da|ze) (best)[\\?]?/i;

client.on('message', async message => {
  if (checkBestRegex.test(message.content) && !message.author.bot) { //  message.author has property user when it's a user and clientUser when it's a bot?
    await handlers.getCurrentBest(message);
  } else if (newBestRegex.test(message.content) && !message.author.bot) {
    await handlers.setNewBest(message);
  }
});

// client.on('message', message => {
// 	if (bestRegex.test(message.content)) {
//     const match = bestRegex.exec(message.content);
//     console.log(`setting ${match[2]} as new best`);
//     await handlers.setNewBest(message);
//     message.channel.send(`${match[2]} has been declared the best!`);
//   }
// });

client.login(process.env.DISCORD_TOKEN);