const Task = require("../ModelBluePrints/taskModel.js");

// User naya task post karta hai
 const createTask = async (req, res) => {
  try {
   
    const { title, description, address, userId, userName } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ message: "title and userId are required" });
    }

    // dummy price: 30 se 120 rupees ke beech (10 ke multiple me)
    const price = (Math.floor(Math.random() * 10) + 3) * 10;
    console.log("upr m hu ")
    const task = await Task.create({
      title,
      description,
      address,
      price,
      createdBy: userId,
      createdByName: userName,
    });
    console.log("neeche m hu ")

    res.status(200).json(task);
  } catch (err) {
    console.log("error m hu ",err.message)
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Rider ko dikhne wale open tasks
 const getAvailableTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ status: "open" }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ek user ke saare tasks (My orders)
 const getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Ek rider ke accepted tasks (in progress + completed)
 const getRiderTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ acceptedBy: req.params.riderId }).sort({ updatedAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Rider task accept karta hai (sirf tab jab abhi bhi open ho)
 const acceptTask = async (req, res) => {
  try {
    const { riderId, riderName,riderPhoneNo } = req.body;

    if (!riderId) {
      return res.status(400).json({ message: "riderId is required" });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, status: "open" },
      { status: "in_progress", acceptedBy: riderId,riderPhoneNo:riderPhoneNo, acceptedByName: riderName || "" },
      { new: true }
    );

    if (!task) {
      return res.status(409).json({ message: "Task already taken" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const { riderId } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, status: "in_progress", acceptedBy: riderId },
      { status: "completed", completedAt: new Date() },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found or not yours" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {createTask,getUserTasks, getAvailableTasks, getRiderTasks, acceptTask, completeTask}