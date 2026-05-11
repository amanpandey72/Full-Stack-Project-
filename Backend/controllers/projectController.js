const Project = require("../models/Project");

// Create Project (Admin)
exports.createProject = async (req, res) => {
  try {
    const { name } = req.body;

    const project = await Project.create({
      name,
      createdBy: req.user.id,
      members: [req.user.id] // creator is member
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get My Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id
    }).populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Member (Admin only)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    // check admin
    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};