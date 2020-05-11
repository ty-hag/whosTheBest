const database = require('./database');
const helpers = require('./helperFunctions');
const moment = require('moment');

const bestRegex = /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/;

const handleDeclaration = (message, newBestWasAYou) => {
  // newBestWasAYou means the author only said "You're the best". In that case we assume they're referring to
  // whoever sent the last message, so newBestWasAYou's value is the author of the previous message
  // If the author specified who is the best, newBestWasAYou is null
  return new Promise(async (resolve, reject) => {
    try {
      const newBest = newBestWasAYou ? newBestWasAYou : bestRegex.exec(message.content)[2];
      const currentBest = await database.getCurrentBest();
      if (currentBest.name.toLowerCase() === newBest.toLowerCase()) {
        message.channel.send(`${newBest} is already the best!`);
        resolve();
      } else {
        // copy current best to previous best to allow for rescissions
        const dataToTransferFromCurrentBestToPrevious = await database.getCurrentBest();
        await database.setPreviousBest(dataToTransferFromCurrentBestToPrevious);

        const dataToSet = {
          name: newBest,
          declaredBy: message.author.username,
          becameBestAt: Date.now()
        }
        await database.setCurrentBest(dataToSet);
        message.channel.send(`${newBest} has been declared the best! Say "I take back that best declaration!" to cancel.`);
        resolve();
      }
    } catch (error) {
      console.log('Error in setNewBest:');
      console.log(error);
      reject(error);
    }
  })
}

const handleQuestionCurrentBest = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, becameBestAt } = await database.getCurrentBest();

      // calculate duration of bestitude
      const checkedAt = moment();
      const durationData = moment.duration(checkedAt.diff(becameBestAt))._data;

      // format message to send to channel, send
      const outputSentence = helpers.getDurationSentence(name, durationData);
      message.channel.send(outputSentence);
      resolve();
    } catch (error) {
      console.log('Error in getCurrentBest:');
      console.log(error);
      reject(error);
    }
  }
  )
}

const handleRescission = message => {
  return new Promise(async (resolve, reject) => {
    try {
      // get currentBest
      const currentBest = await database.getCurrentBest();
      // if message's author is not same as currentBest author, don't change anything, send message
      if (message.author.username !== currentBest.declaredBy) {
        message.channel.send(`Only the person who made the declaration(${currentBest.declaredBy}) can take it back!`);
        resolve();
      } else {
        // get previous best
        const previousBest = await database.getPreviousBest();
        // if previous best name is same as current best, don't change, send message saying its already been brought back
        // (can't rescind more than one declaration back)
        if (previousBest.name === currentBest.name) {
          message.channel.send(`${currentBest.name} has already been reset to, you can't go back to the next preceding best.`);
          resolve();
        } else {
          // else copy previous best to current best, send message
          await database.setCurrentBest(previousBest);
          message.channel.send(`${currentBest.declaredBy} decided ${currentBest.name} wasn't really the best. Now ${previousBest.name} is best again!`);
          resolve();
        }
      }
    } catch (error) {
      console.log('Error in handleRescission:');
      console.log(error);
      reject(error);
    }
  })
}

module.exports = {
  handleDeclaration,
  handleQuestionCurrentBest,
  handleRescission
}