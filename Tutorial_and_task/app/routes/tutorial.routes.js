const auth = require('../config/auth')
module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();
    router.post("/create",auth.verifyToken, tutorials.create);
    router.get("/find", auth.verifyToken,tutorials.findAll);
    router.get("/published",auth.verifyToken,tutorials.findAllPublished);
    router.get("/findone",auth.verifyToken, tutorials.findOne);
    router.put("/update", auth.verifyToken,tutorials.update);
    router.delete("/deleteone",auth.verifyToken, tutorials.delete);
    router.delete("/delete",auth.verifyToken, tutorials.deleteAll);
    app.use('/app/routes/tutorials', router);
};