const bcrypt = require('bcrypt');

// Hash the password
const hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Adjust as necessary based on performance
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (e) {
    console.error('Error hashing the password:', e);
    throw new Error('Error hashing the password');
  }
};

// Compare the plain password with the hashed password
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (e) {
    console.error('Error comparing passwords:', e);
    throw new Error('Error comparing passwords');
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
