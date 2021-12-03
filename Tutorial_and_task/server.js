const express = require("express");
const cors = require("cors");
// const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';

// const jwt = require('jsonwebtoken');
const app = express();
const userRoute=require("./app/routes/user.route");
const taskRoute=require("./app/routes/task.route");
const taskAssignRoute=require("./app/routes/taskAssign.route");
var corsOptions = {
    origin:"http://localhost:8081"
};
require('./app/models/user.model');
require('./app/config/passport');
// app.use(require('./app/routes/user.route'));
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(!isProduction) {
    app.use(errorHandler());
  }

const db = require("./app/models");
db.mongoose.connect(db.url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{
    console.log("Connected to the database");
})

.catch(err => {
    console.log("cannot connect",err);
    process.exit();
});

if(!isProduction) {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
  
      res.json({
        errors: {
          message: err.message,
          error: err,
        },
      });
    });
  }
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    res.json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  });


require("./app/routes/tutorial.routes")(app);
app.use("/app/routes/user",userRoute);
app.use("/app/routes/task",taskRoute);
app.use("/app/routes/task",taskAssignRoute);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});