const { users } = require('./userBirthdays.json');

var method = {};

method.checkForBirthday = function() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1; //month is 0-based so add 1
  console.log("Today's date: " + day + "-" + month);
  for (var user of users) {
    if (user.day == day && user.month == month) {
      if (user.message) {
        console.log("Sending message to " + user.name)
        return user.message + " <@" + user.id + ">!"
      }
      console.log("Sending message to " + user.name)
      return "Happy birthday <@" + user.id + ">!";
    }
  }
  return null;
}

module.exports = method;
