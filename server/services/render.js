const axios = require('axios');

exports.homeRoutes = (req, res) => {
  /*if (!req.user) {
    res.redirect('/login_user');
  }*/
  //console.log(res.locals.loggedInUser.role);
  axios
    .get('http://localhost:3000/api/users', {
      headers: { Cookie: `${req.headers.cookie}` },
    })
    .then(function (response) {
      if (res.locals.loggedInUser.role === 'User') {
        return res.render('index', {
          users: response.data.filter(
            (x) => x.name === res.locals.loggedInUser.name
          ),
        });
      }
      res.render('index', { users: response.data });
    })
    .catch((err) => {
      res.send(err);
    });
};

exports.add_user = (req, res) => {
  res.render('add_user');
};

exports.update_user = (req, res) => {
  axios
    .get('http://localhost:3000/api/users', {
      params: { id: req.query.id },
      headers: { Cookie: `${req.headers.cookie}` },
    })
    .then(function (userdata) {
      res.render('update_user', { user: userdata.data });
    })
    .catch((err) => {
      res.send(err);
    });
};
