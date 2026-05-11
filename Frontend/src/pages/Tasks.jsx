
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");

      setProjects(res.data);

      // Auto select first project
      if (res.data.length > 0) {
        setProjectId(res.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const res = await API.get(
        `/tasks?projectId=${projectId}`
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Create Task
  const createTask = async () => {
    if (!title) {
      return alert("Task title is required");
    }

    try {
      setCreating(true);

      await API.post("/tasks", {
        title,
        projectId,
      });

      setTitle("");

      fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create task"
      );
    } finally {
      setCreating(false);
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, {
        status,
      });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // Badge Style
  const getBadgeClass = (status) => {
    if (status === "todo") return "badge todo";

    if (status === "in-progress")
      return "badge progress";

    return "badge done";
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>
        Task Management
      </h1>

      {/* Create Task */}
      <div className="card">
        <h2>Create New Task</h2>

        <div style={{ marginTop: "20px" }}>
          {/* Project Dropdown */}
          <label>Select Project</label>

          <select
            value={projectId}
            onChange={(e) =>
              setProjectId(e.target.value)
            }
          >
            {projects.map((project) => (
              <option
                key={project._id}
                value={project._id}
              >
                {project.name}
              </option>
            ))}
          </select>

          {/* Task Title */}
          <label>Task Title</label>

          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <button onClick={createTask}>
            {creating
              ? "Creating..."
              : "Create Task"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="center-message">
          <h3>Loading tasks...</h3>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {tasks.length === 0 ? (
            <div
              className="card"
              style={{
                marginTop: "25px",
                textAlign: "center",
              }}
            >
              <h3>No tasks found</h3>

              <p
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                }}
              >
                Create tasks to manage your project
                workflow.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-2"
              style={{ marginTop: "25px" }}
            >
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="card"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <h2>{task.title}</h2>

                    <span
                      className={getBadgeClass(
                        task.status
                      )}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p
                    style={{
                      marginTop: "15px",
                      color: "#6b7280",
                    }}
                  >
                    Track progress and update task
                    workflow efficiently.
                  </p>

                  {/* Buttons */}
                  <div
                    style={{
                      marginTop: "20px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "in-progress"
                        )
                      }
                    >
                      Start
                    </button>

                    <button
                      style={{
                        background: "#16a34a",
                      }}
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "done"
                        )
                      }
                    >
                      Mark Done
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}