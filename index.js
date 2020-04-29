/*

Discord bot to keep track of who is the best

*/

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