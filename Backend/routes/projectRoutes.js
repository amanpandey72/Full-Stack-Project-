const express = require("express");
const {
  createProject,
  getProjects,
  addMember
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.put("/:id/add-member", authMiddleware, addMember);

module.exports = router;