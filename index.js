/*

Discord bot to keep track of who is the best

TODO:
Handle pronouns

*/

const handlers = require('./modules/handlers');
const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('whosTheBest bot active!');
});

const youBestRegex = /^(.*, )?(you|you're|ur|you are) (the|da|tha) (best|bes|bestest)/i;
const newBestRegex = /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|teh|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/i;
const checkBestRegex = /(who's|who|who is) (the|da|ze) (best)[\\?]?/i;
let authorOfLastMessage = '';

client.on('message', async message => {
  if(youBestRegex.test(message.content) && !message.author.bot){
    await handlers.setNewBest(message, authorOfLastMessage);
  } else if (checkBestRegex.test(message.content) && !message.author.bot) { //  message.author has property user when it's a user and clientUser when it's a bot?
    await handlers.getCurrentBest(message);
  } else if (newBestRegex.test(message.content) && !message.author.bot) {
    await handlers.setNewBest(message, null);
  }

  if(!message.author.bot && (message.author.username !== authorOfLastMessage)){
    authorOfLastMessage = message.author.username;
  }

});

client.login(process.env.DISCORD_TOKEN);