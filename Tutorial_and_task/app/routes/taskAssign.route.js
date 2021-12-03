const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const taskAssign = require("../controllers/taskAssign.controller")
const auth = require("../config/auth");


router.put("/assign",auth.verifyToken,taskAssign.assignTask);
router.put("/complete",auth.verifyToken,taskAssign.completeTask);

module.exports=router;