const Task = require("../models/task.model");
const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const { TASK_STATE, ROLE } = require("../routes/constant");

exports.assignTask = async (req, res) => {
    try {
        const id1 = req.body.assignBy; //Teacher
        const id2 = req.body.assignTo; //Student
        const id3 = req.body.task_id;  //Task
        const teacherData = await Users.findById(id1)
        const studentData = await Users.findById(id2)
        const taskdata = await Task.findById(id3)

        console.log(id2);
        var count = 0;
        if(teacherData.role===ROLE.TEACHER)
        {
            if(studentData.role === ROLE.STUDENT)
            {
                if(taskdata.createdBy === id1)
                {
                    for (var i = 0; i < studentData.task.length; i++) {
                        if (studentData.task[i] === id3)
                        { 
                            count= 1;
                            break;
                        }
                    }
                    if(count>=1)
                    {
                        res.send({message:"task already assinged"});
                    }
                    else
                    {
                        this.updatetask(req, res);
                    }
                }
                else{
                        res.send({message:"not valid user"});
                }
            }
            else{
                res.send({message: "He/She is not valid Student"});
            }
        }
        else
        {
            res.send({message: "you are not a teacher"});
        }
    }
    catch (error) {

        console.log("not assinged");
        res.status(500)
            .send({ message: "Error to retrieve"});
    }
};


exports.updatetask =async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send({
                message: "data to update can not be empty"
            });
        }

        const id = req.body.assignTo;
        const task_id = req.body.task_id;
        const updateReponse = await Task.findByIdAndUpdate(task_id, {assignTo: req.body.assignTo, state: TASK_STATE.ASSIGNED, assignDate: new Date(), }, { useFindAndModify: false })
        const userUpdateResponse=await Users.findByIdAndUpdate({_id:req.body.assignTo},{ $push: { task: req.body.task_id } },{ useFindAndModify: false })
        console.log("updated")
        res.send({message:"updated"});


    }
    catch (error) {

        res.status(500).json({
            statusCode: 500,message:"internal error",  message: "Task not assinged"});
    }

};


// exports.updatetask = (req, res) => {
//     if (!req.body) {
//         return res.status(400).send({
//             message: "data to update can not be empty"
//         });
//     }

//     const id = req.body.assignTo;
//     const task_id = req.body.task_id;
//     Task.findByIdAndUpdate(task_id, {assignBy: req.body.assignBy,assignTo:req.body.assignTo,state:TASK_STATE.ASSIGNED}, { useFindAndModify: false })
//         .then(data => {
//             if (!data) {
//                 res.status(404).send({
//                     message: `cannot update with id = ${task_id}.`
//                 });
//             }
//             else 
//             {
//                 res.status(200).json({
//                     statusCode: 200,  message: "Task Assinged to the id = " + id});

//             // res.send({ message: "Task Assinged to the id = " + id });
//             }
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: "Error updated with id = " + task_id
//             });
//         });
// };


exports.completeTask = async (req, res) => {
    try {
        var count = 0;
        const id1 = req.body.assignTo; //Teacher
        const id2 = req.body.task_id; //task
        const studentData = await Users.findById(id1)
        const taskdata = await Task.findById(id2)
        // res.status(404).send({ message: "Not found with id = " + id });
        // console.log("student data", JSON.stringify(studentData))
        if(studentData.role===ROLE.STUDENT)
        {
            if(taskdata.assignTo === id1)
            {
                for (var i = 0; i < studentData.task.length; i++) {
                    if (studentData.task[i] === id2)
                    { 
                        count= 1;
                        break;
                    }
                }
                if(count>=1)
                {
                    this.updatedtask(req, res);
                }
                else
                {
                    res.send({message:"Task not existed of this type"});
                }
            }
            else{
                res.send({message:"you are not valid user"});
            }
        }
        else
        {
            res.send({message: "you are not a student"});
        }
    }
    catch (error) {

        console.log("not assinged");
        res.status(500)
            .send({ message: "Error to retrieve "});
    }
};


exports.updatedtask = async (req, res) => {
    try{
    // if (!req.body) {
    //     return res.status(400).send({
    //         message: "data to update can not be empty"
    //     });
    // }

    const id = req.body.assignTo;
    const task_id = req.body.task_id;
    console.log(task_id)
    const taskUpdatedResponse = await Task.findByIdAndUpdate(task_id, {state:TASK_STATE.COMPLETED}, { useFindAndModify: false })
    const userUpdateResponse=await Users.findByIdAndUpdate({_id:req.body.assignTo},{ $pull: { task: req.body.task_id } },{ useFindAndModify: false })
    res.send({message:"Task Completed"})
    }
    catch (error) {

        console.log("not completed");
        res.status(500)
            .send({ message: "not completed" });
    }
};