const mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: 'Male',
  },
  status: {
    type: String,
    default: 'Active',
  },
  role: {
    type: String,
    default: 'User',
  },
  hash: String,
  salt: String,
});

const userDB = mongoose.model('userdb', schema);

module.exports = userDB;
