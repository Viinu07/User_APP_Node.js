var userDB = require('../model/model');
const utils = require('../common/utils');
//Middleware to check if user logged in

//Creating and Saving New Users

exports.create = (req, res) => {
  //Validating requests
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
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
      res.send(data);
      //res.redirect('/');
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
  //console.log(res.locals.loggedInUser)
  const {offset,limit} = req.query
  const sort = req.query.sort || "name"
  const sortDirection = req.query.sortDirection || "asc"
  if (req.params.id) {
    const id = req.params.id;
    userDB
      .findById(id)
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: 'Not found user id with id' + id });
        } else {
          if(res.locals.loggedInUser.role === "User" && res.locals.loggedInUser.id === id)
          return res.send(data);
          if(res.locals.loggedInUser.role === "Manager")
          return res.send(data);
          return res.status(403).send({message:"You are not allowed to access this id information " + id})
        }
      })
      .catch((err) => {
       return res.status(500).send({ message: 'Error retrieving user with id' + id });
      });
  } else {
    //console.log(limit,offset)
    userDB
      .find().sort({[sort]:sortDirection})
      .skip(offset ? parseInt(offset) : 0).limit(limit ? parseInt(limit) : null)
      .then((user) => {
        console.log(res.locals.loggedInUser.id);
        if(res.locals.loggedInUser.role === "User")
        {res.send(user.filter(
          (x) => x.id === res.locals.loggedInUser.id
        ));}
       else {res.send(user);}
      })
      .catch((err) => {
       return res.status(500).send({
          message:
            err.message || 'Error occured while retriving user information',
        });
      });
  }
};

//Updating an User

exports.update = (req, res) => {
  //console.log(res.locals.loggedInUser)
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    return res.status(400).send({ message: 'Update data should not be empty' });
  }
  const id = req.params.id;
  if((res.locals.loggedInUser.role === "User" && res.locals.loggedInUser.id === id )|| res.locals.loggedInUser.role === "Manager")
  {
  userDB
  .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  .then((data) => {
    if (!data) {
       res
        .status(404)
        .send({ message: `Cannot update user with ${id}. User Not Found!` });
    } else {
       res.send({message:`User update is successful for ${id}`});
    }
  })
  .catch((err) => {
    res.status(500).send({ message: 'User id unmatch' });
  });
  }else{
    res.status(403).send({message:"You are not allowed to update this id information " + id})
  }
};

//Deleting an User

exports.delete = (req, res) => {
  const id = req.params.id;
  if((res.locals.loggedInUser.role === "User" && res.locals.loggedInUser.id === id )|| res.locals.loggedInUser.role === "Manager")
  {
    userDB
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
      return  res
          .status(404)
          .send({ message: `Cannot delete with id ${id}. Check your id` });
      } else {
      return  res.send({
          mesage: 'User was deleted successfully',
        });
      }
    })
    .catch((err) => {
    return  res.status(500).send({
        message: 'Could not delete User with the id = ' + id,
      });
    });
  }else{
    res.status(403).send({message:"You are not allowed to delete this id information " + id})
  }
};
