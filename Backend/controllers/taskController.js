const Task = require("../models/Task");
const Project = require("../models/Project");

// Create Task (Admin only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } = req.body;

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // Only admin can create tasks
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      projectId,
      assignedTo
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Tasks by Project
exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;

    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Task Status (Member can update their own)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only assigned user can update
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = req.body.status || task.status;

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};