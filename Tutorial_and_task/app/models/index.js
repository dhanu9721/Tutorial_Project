const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
mongoose.promise = global.promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorials = require("./tutorial.model.js")(mongoose);
module.exports = db;