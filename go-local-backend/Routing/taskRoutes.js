const express = require('express');
const router=express.Router();

const {
  createTask,
  getAvailableTasks,
  getUserTasks,
  getRiderTasks,
  acceptTask,
  completeTask,
} = require("../controllerLogic/controllerTask.js");


router.post("/", createTask);
router.get("/available", getAvailableTasks);
router.get("/user/:userId", getUserTasks);
router.get("/rider/:riderId", getRiderTasks);
router.patch("/:id/accept", acceptTask);
router.patch("/:id/complete", completeTask);

module.exports = router;