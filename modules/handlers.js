const database = require('./database');
const helpers = require('./helperFunctions');
const Discord = require('discord.js');
const moment = require('moment');

const bestRegex = /(.*[!,.:;] )?(.*[^,])('s| is| iz|,? you're|,? you're|,? you are|,? you|,? u| are| r) (the|da|ze|duh|tha) (best|bez|bes|bestest)(.*[^\\?]$)/;

const setNewBest = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newBest = bestRegex.exec(message.content)[2];
      const resultMessage = await database.changeCurrentBest(newBest);
      message.channel.send(resultMessage);
      resolve();
    } catch (error) {
      console.log('Error in setNewBest:');
      console.log(error);
      reject(error);
    }
  })
}

const getCurrentBest = (message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, becameBestAt } = await database.checkCurrentBest();

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

module.exports = {
  setNewBest,
  getCurrentBest
}