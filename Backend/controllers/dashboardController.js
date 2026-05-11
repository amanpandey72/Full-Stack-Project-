const Task = require("../models/Task");

// Dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total tasks
    const totalTasks = await Task.countDocuments();

    // Tasks by status
    const todo = await Task.countDocuments({ status: "todo" });
    const inProgress = await Task.countDocuments({ status: "in-progress" });
    const done = await Task.countDocuments({ status: "done" });

    // Overdue tasks
    const overdue = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    // Tasks per user
    const tasksPerUser = await Task.aggregate([
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTasks,
      status: {
        todo,
        inProgress,
        done
      },
      overdue,
      tasksPerUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};