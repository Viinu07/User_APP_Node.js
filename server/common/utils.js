const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 */
function issueJWT(user) {
  //console.log(user);
  const _id = user._id;
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, 'supersecretCode', {
    expiresIn: expiresIn,
  });

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  };
}

/**
 * -------------- HELPER FUNCTIONS ----------------
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

/**
 *
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
