const crypto = require('crypto');

module.exports.generateOTP = () => {
   const timestamp = Date.now() + 5 * 60 * 1000;
   return crypto.randomBytes(32).toString('hex') + timestamp.toString(16);
}

module.exports.validateToken = (token) => {
    const tokenLength = token.length - 13; // Extract the token length (length - length of timestamp)
    const actualToken = token.substring(0, tokenLength); // Extract the actual token
    const timestamp = parseInt(token.substring(tokenLength), 16); // Extract the timestamp
  
    // Check if the token has expired
    if (Date.now() > timestamp) {
      return false;
    }
  
    // Additional validation logic if needed
  
    return true;
  };