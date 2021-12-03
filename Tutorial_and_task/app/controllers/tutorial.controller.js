const { RSA_NO_PADDING } = require("constants");
const db = require("../models");
const Tutorial = db.tutorials;

exports.create = async function (req, res) {
    try {
        if (!req.body.data) {
            res.status(400).send({ message: "content cannot be empty" });
            return;
        }
        console.log("body dTT", JSON.stringify(req.body))
        // const tutorial = new Tutorial({
        //     title: req.body.title,
        //     description: req.body.description,
        //     published: req.body.published ? req.body.published : false
        // });

        const data = await Tutorial.insertMany(req.body.data)
        res.json({statusCode:200,message:"Data Insetred successfully",data:data})
    }
    catch (error) {
        console.log("Error in inserting data",JSON.stringify(error))
        res.status(500).send({
            message: err.message || "some error occured"
        });
    }
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    // const username = req.query.username;
    // const password = req.query.password;
    var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
    // var condition = username ? { username: { $regex: new RegExp(username), $options: "i" } } : {};
    // var condition = password ? { password: { $regex: new RegExp(password), $options: "i" } } : {};
    Tutorial.find(condition).then(data => {
        res.send(data);
    // Tutorial.find(condition).then(users => {
    //         res.send(users);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "some error occur while retrieving"
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.body.tut_id;
    Tutorial.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found with id" + id });
            else res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error retrieving with id = " + id });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "data to update can not be empty"
        });
    }

    const id = req.body.tut_id;
    Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `cannot update with id = ${id}.`
                });
            }
            else res.send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updated with id = " + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.body.tut_id;

    Tutorial.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `cannot delete with is = ${id}.`
                });
            }
            else {
                res.send({
                    message: "Deleted successfully"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "could not delete with id = " + id
            });
        });
};

exports.deleteAll = (req, res) => {
    Tutorial.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount}. Deleted all data Successfully`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "some error occurred while removing"
            });
        });
};

exports.findAllPublished = (req, res) => {
    Tutorial.find({ published: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "some error occured while retrieving"
            });
        });
};