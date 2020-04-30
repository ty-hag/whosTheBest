const getDurationSentence = (bestPerson, data) => {
// take a name and an object with different time durations, return string describing them
// data object should have these properties
// { milliseconds: 61,
//   seconds: 40,
//   minutes: 19,
//   hours: 22,
//   days: 0,
//   months: 0,
//   years: 0 },

const years = data.years > 0 ? ` ${data.years} years,`: '';
const months = data.months > 0 ? ` ${data.months} months,`: '';
const days = data.days > 0 ? ` ${data.days} days,`: '';
const hours = data.hours > 0 ? ` ${data.hours} hours,`: '';
const minutes = data.minutes > 0 ? ` ${data.minutes} minutes,`: '';
const seconds = data.seconds > 0 ? ` ${data.seconds} seconds,`: '';
const milliseconds = data.milliseconds > 0 ? ` ${data.seconds > 0 ? 'and' : ''} ${data.milliseconds} milliseconds.`: '';

return `${bestPerson} is the best and has been so for${ years + months + days + hours + minutes + seconds + milliseconds}`;
};

module.exports = {
  getDurationSentence
}

