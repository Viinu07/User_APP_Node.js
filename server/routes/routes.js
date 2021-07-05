const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');
const User = require('mongoose').model('userdb');
const passport = require('passport');
const utils = require('../common/utils');

const userLoggedIn = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    //console.log(user);
    if (user) {
      res.locals.loggedInUser = user;
      next();
    } else {
      res.redirect('/login_user');
    }
  })(req, res, next);
};

route.post('/login', function (req, res, next) {
  User.findOne({ name: req.body.username })
    .then((user) => {
      //console.log('user', user);
      if (!user) {
        res.redirect('/login_user');
        //res.status(401).json({ success: false, msg: 'could not find user' });
      }

      // Function defined at bottom of app.js
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.cookie('token', tokenObject.token.split(' ')[1]);
        //console.log('valid');
        //res.setHeader('cookie', tokenObject.token);
        /*res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
        });*/
        res.redirect('/');
      } else {
        res.redirect('/login_user');
        /*res
          .status(401)
          .json({ success: false, msg: 'you entered the wrong password' });*/
      }
    })
    .catch((err) => {
      next(err);
    });
});

route.get('/', userLoggedIn, services.homeRoutes);

route.get('/add-user', services.add_user);

route.get('/update-user', userLoggedIn, services.update_user);

//Handling API

route.post('/api/users', controller.create);
route.get('/api/users', userLoggedIn, controller.find);
route.put('/api/users/:id', userLoggedIn, controller.update);
route.delete('/api/users/:id', userLoggedIn, controller.delete);

route.get('/login_user', (req, res) => {
  res.render('login_user');
});

route.get('/logout', (req, res) => {
  req.logOut;
  res.clearCookie('token');
  res.redirect('/login_user');
});

module.exports = route;
