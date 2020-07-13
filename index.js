/*

Discord bot to keep track of who is the best

*/


const handlers = require('./modules/handlers');
const Discord = require('discord.js');
const { youBestRegex, ambiguousBestRegex, newBestRegex, checkBestRegex, rescindRegex } = require('./regexs');

const client = new Discord.Client();

client.once('ready', () => {
  console.log('whosTheBest bot active!');
});

client.on('message', async message => {

  if (message.author.bot) {
    return;
  } else if (rescindRegex.test(message.content)) {
    await handlers.handleRescission(message);
  } else if (youBestRegex.test(message.content)) {
    if(messageAuthorTracker.lastActive === '') {
      message.channel.send(`Sorry, I've just joined the channel and I'm not sure who you're refering to.`);
    } else {
      await handlers.handleDeclaration(message, messageAuthorTracker.lastActive)
    }
  } else if (ambiguousBestRegex.test(message.content)) {
    //await handlers.handleDeclaration(message, null);
    console.log('ambiguous declaration detected!')
    message.channel.send('ambiguous!');
  } else if (checkBestRegex.test(message.content)) {
    await handlers.handleQuestionCurrentBest(message);
  } else if (newBestRegex.test(message.content)) {
    await handlers.handleDeclaration(message, null);
  }

});

client.login(process.env.DISCORD_TOKEN);

/*

TODO:

Testing
- (DONE) Write test for database functions
  - (DONE) Tests for getCurrentBest
  - (DONE) Tests for setCurrentBest

Handle pronouns
- (DONE) 2nd person
- (NOT STARTED) 3rd person
  - (NOT STARTED) Consider: if user says pronoun only, bot asks for specific name, if you again, bot is declared the best 

(DONE) Seed test database

Send message to channel on join?
https://stackoverflow.com/questions/45120618/send-a-message-with-discord-js



*/