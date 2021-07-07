const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');

// Pass the global passport object into the configuration function
require('./server/model/model');

require('./server/common/passport')(passport);

const connectDB = require('./server/database/connection');

dotenv.config({ path: 'config.env' });

const PORT = process.env.PORT || 8000;

//log requests monitoring using morgan

app.use(morgan('tiny'));

//Connecting MongoDB
connectDB();

//parse request to body-parser
//app.use(express.urlencoded({ extended: true }));
app.use(express.json())
/*app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);*/

// This will initialize the passport object on every request
app.use(passport.initialize());
app.use(passport.session());

//app.use(passport.authenticate('jwt', { session: false }));
//set view engine
app.set('view engine', 'ejs');
// app.set('views', path.resolve(__dirname));

//loading assets
// app.use('/css', express.static(path.resolve(__dirname, 'assets/css')));
// app.use('/img', express.static(path.resolve(__dirname, 'assets/img')));
// app.use('/js', express.static(path.resolve(__dirname, 'assets/js')));

//Loading routers
app.use('/', require('./server/routes/routes'));

app.use("*",(req,res,next)=>{
  res.json({message:"the route does not exist"})
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
