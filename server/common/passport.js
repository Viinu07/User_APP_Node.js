// File: ./config/passport
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('userdb');

const getCookieByName = (cookies, name) => {
  const arrOfCookies = cookies.split(';');
  let yourCookie = null;

  arrOfCookies.forEach((element) => {
    if (element.includes(name)) {
      yourCookie = element.replace(name + '=', '');
    }
  });
  return yourCookie;
};

var cookieExtractor = function (req) {
  var token = null;
  //console.log(req);
  //console.log(req.headers);
  if (req && req.headers.cookie) {
    console.log(getCookieByName(req.headers.cookie, 'token'));
    token = getCookieByName(req.headers.cookie, 'token');
  }
  return token;
};

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: 'supersecretCode',
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(
    new JwtStrategy(options, function (jwt_payload, done) {
      // Since we are here, the JWT is valid!
      //console.log(jwt_payload);
      // We will assign the `sub` property on the JWT to the database ID of user
      User.findOne({ _id: jwt_payload.sub }, function (err, user) {
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        //console.log(user);
        if (err) {
          return done(err, false);
        }
        if (user) {
          // Since we are here, the JWT is valid and our user is valid, so we are authorized!
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
  );
};
