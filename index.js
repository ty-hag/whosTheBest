/*

Discord bot to keep track of who is the best

TODO:

Testing
- (WIP) Write test for database functions
  - (DONE) Tests for getCurrentBest
  - (DONE) Tests for setCurrentBest
- (NOT STARTED) Write tests for handlers.handleDeclaration
 - (NOT STARTED) Write test for duplicate best declaration
 - (NOT STARTED) Write test for ambiguous best declaration
 - (NOT STARTED) Write test for new best declaration

Handle pronouns
- (DONE) 2nd person
- (NOT STARTED) Buggy? If bot just booted and first input received is "you're the best", this line in handleDeclaration breaks bc empty string is passed for newBestWasAYou:
    const newBest = newBestWasAYou ? newBestWasAYou : bestRegex.exec(message.content)[2];
- (NOT STARTED) 3rd person
- (NOT STARTED) Consider: if user says pronoun only, bot asks for specific name, if you again, bot is declared the best 

(DONE) Seed test database

*/


const handlers = require('./modules/handlers');
const Discord = require('discord.js');
const { youBestRegex, newBestRegex, checkBestRegex, rescindRegex } = require('./regexs');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('whosTheBest bot active!');
});

let authorOfLastMessage = '';

client.on('message', async message => {

  if (message.author.bot) {
    return;
  } else if (rescindRegex.test(message.content)) {
    await handlers.handleRescission(message);
  } else if (youBestRegex.test(message.content)) {
    await handlers.handleDeclaration(message, authorOfLastMessage);
  } else if (checkBestRegex.test(message.content)) {
    await handlers.handleQuestionCurrentBest(message);
  } else if (newBestRegex.test(message.content)) {
    await handlers.handleDeclaration(message, null);
  }

  if (message.author.username !== authorOfLastMessage) {
    authorOfLastMessage = message.author.username;
  }

});

client.login(process.env.DISCORD_TOKEN);