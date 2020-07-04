const colors = require('colors');
const printHeader = require('./printHeader');

const emptyInputCheck = async (input) => {
  try {
    if (!input) {
      printHeader();
      console.log('You need to input something.'.red.bold);
      return false;
    } else {
      return true;
    }
  } catch (err) {
    if (err) return err;
  }
};

const emailValidator = async (email) => {
  // Regex that checks for a valid email string
  valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

  if (valid) {
    return true;
  } else {
    console.clear();
    printHeader();
    console.log('Invalid email entered!'.red.bold);
    return false;
  }
};

module.exports = { emptyInputCheck, emailValidator };
