const Task = require('../models/Task');

// # GET ALL TASKS
const getAllTasks = (req, res) => {
  res.send('get all tasks');
};

// # CREATE A TASK
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

// # GET A SINGLE TASK
const getTask = (req, res) => {
  res.json({ id: req.params.id });
};

// # UPDATE A TASK
const updateTask = (req, res) => {
  res.send('update task');
};

// # DELETE A TASK
const deleteTask = (req, res) => {
  res.send('delete task');
};

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};