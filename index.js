/*

Discord bot to keep track of who is the best

*/

const db = require('./modules/database');

const testUpdate = async () => {
  console.log('Testing update function.')
  await db.changeCurrentBest('Croddler');
  await db.disconnect();
  console.log('Testing complete.')
}

testUpdate();