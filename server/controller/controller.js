var userDB = require('../model/model');
const utils = require('../common/utils');
//Middleware to check if user logged in

//Creating and Saving New Users

exports.create = (req, res) => {
  //Validating requests
  if (!req.body) {
    res.status(400).send({ message: 'Please Fill the details!' });
    return;
  }
  //Creating a New User
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const user = new userDB({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    status: req.body.status,
    hash: hash,
    salt: salt,
    role: req.body.role,
  });

  user
    .save(user)
    .then((data) => {
      /* res.send(data); */
      res.redirect('/');
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occured',
      });
    });
};

//Retrievig and Returning all Users

exports.find = (req, res) => {
  //Returning single user
  if (req.query.id) {
    const id = req.query.id;
    userDB
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: 'Not found user id with id' + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: 'Error retrieving user with id' + id });
      });
  } else {
    userDB
      .find()
      .then((user) => {
        //console.log(user);
        res.send(user);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Error occured while retriving user information',
        });
      });
  }
};

//Updating an User

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: 'Update data should not be empty' });
  }
  const id = req.params.id;
  userDB
    .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot update user with ${id}. User Not Found!` });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error with Updated user information' });
    });
};

//Deleting an User

exports.delete = (req, res) => {
  const id = req.params.id;
  userDB
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot delete with id ${id}. Check your id` });
      } else {
        res.send({
          mesage: ' User was deleted successfully',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete User with the id = ' + id,
      });
    });
};
