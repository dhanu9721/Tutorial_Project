const Task = require("../models/task.model");
// const User = require("../models/user.model");
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const { TASK_STATE,ROLE } = require("../routes/constant");
// const AUTH=require("../config/auth");

exports.createTask = async (req, res) => {
    try {
        const id = req.body.createBy; //Teacher
        TASK_STATE
        const teacherData = await Users.findById(id)
        // res.status(404).send({ message: "Not found with id = " + id });
        // console.log("teacher data", JSON.stringify(teacherData))
        if(teacherData.role===ROLE.TEACHER)
        {
            this.taskCreate(req, res);
        }
        else
        {
            res.send({message: "you are not a teacher"});
        }
    }
    catch (error) {

        console.log("not created");
        res.status(500).json({
            statusCode: 500,message:"internal error",  message: "Task not created"});
    }
};


exports.taskCreate = async (req, res) => {
    // console.log("task Create");
    if (!req.body.taskname) {
        res.status(400).json({
            statusCode: 400,message:"Bad Request",  message: "Task not created"});
        return;
    }
    const task = new Task({
        taskname: req.body.taskname,
        state: TASK_STATE.NOT_ASSIGNED,
        // assignTo: req.body.assignTo,
        // assignBy: req.body.assignBy,
        createdBy:req.body.createBy
        // assignDate: new Date(),
        // completed:req.body.completed
        // email: req.body.email,
        // isAdmin: req.body.isAdmin
    });

    // Save task in the database
    try{
        //  var tasknewid;
    task.save(function(err,task_ids)
    {
        const tasknewid = task_ids._id;
        const userUpdateResponse=Users.findByIdAndUpdate({_id:req.body.createBy},{ $push: { task: task_ids._id } },{ useFindAndModify: false },
        (err, data) =>{
        }    
        )
        
    })
    // const task = await Users.findById(id2)
            
            // const userUpdateResponse=await Users.findByIdAndUpdate({_id:req.body.assignBy},{ $push: { task: tasknewid } },{ useFindAndModify: false })
            // res.status(200).json({
            //     statusCode: 200,message:"successful",  message: "Task created by the id = " + id});
            // res.send(data);
            res.send({message: "Task created"});
        }
    catch (error) {

        console.log("task not created");
        res.status(500)
            .send({ message: "Error to retrieve"});
    }
};

exports.findAll = (req, res) => {
    const taskname = req.query.taskname;
    var condition = taskname ? { taskname: { $regex: new RegExp(taskname), $options: "i" } } : {};
    Task.find(condition).then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message: err.message || "some error occur while retrieving"
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.body.task_id;
    Task.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found" });
            else res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({ message: "Error to retrieve"});
        });
};

exports.updateTask = async (req, res) => {
    try {
        const id1 = req.body.updateBy; //Teacher
        const id2 = req.body.task_id;
        TASK_STATE
        const teacherData = await Users.findById(id1)
        const taskdata = await Task.findById(id2)

        // res.status(404).send({ message: "Not found with id = " + id });
        // console.log("teacher data", JSON.stringify(teacherData))
        if(teacherData.role===ROLE.TEACHER)
        {
            if(taskdata.createdBy === id1)
            {
            this.update(req, res);
            }
            else{
                res.send({message: "you are not valid user"});
            }
        }
        else
        {
            res.send({message: "you are not a teacher"});
        }
    }
    catch (error) {

        console.log("not updated");
        res.status(500).json({
            statusCode: 500,message:"internal error",  message: "Task not updated"});
    }
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "data to update can not be empty"
        });
    }

    const id = req.body.task_id;
    Task.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `cannot updated`
                });
            }
            else res.send({ message: "Updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updated"
            });
        });
};

exports.deleteTask = async (req, res) => {
    try {
        const id1 = req.body.deleteBy; //Teacher
        const id2 = req.body.task_id;  //Task
        TASK_STATE
        const teacherData = await Users.findById(id1)
        const taskdata = await Task.findById(id2)
        // res.status(404).send({ message: "Not found with id = " + id });
        // console.log("teacher data", JSON.stringify(teacherData))
        if(teacherData.role===ROLE.TEACHER)
        {
            if(taskdata.createdBy === id1)
            {
                this.delete(req, res);
            }
            else{
                res.send({message:"you are not valid user"});
            }
        }
        else
        {
            res.send({message: "you are not a teacher"});
        }
    }
    catch (error) {

        console.log("not deleted");
        res.status(500).json({
            statusCode: 500,message:"internal error",  message: "you are not valid user"});
    }
};


exports.delete = (req, res) => {
    const id = req.body.task_id;

    Task.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).json({
                    statusCode: 404,message:"Not Found",  message: "This task does not exist"});
            }
            else {
                res.status(200).json({
                    statusCode: 200,message:"successful",  message: "Task Deleted"});
            }
        })
        .catch(err => {
            res.status(500).json({
                statusCode: 500,message:"internl error",  message: "some error occur while deleting the task"});
        });
};