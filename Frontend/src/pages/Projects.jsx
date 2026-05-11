import { useEffect, useState } from "react";
import API from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get("/projects");

      setProjects(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch projects"
      );
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!name.trim()) {
      return alert("Project name is required");
    }

    try {
      setCreating(true);

      await API.post("/projects", { name });

      setName("");

      fetchProjects();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create project"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>
        Project Management
      </h1>

      {/* Create Project */}
      <div className="card">
        <h2>Create New Project</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "15px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Enter project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1 }}
          />

          <button onClick={createProject}>
            {creating
              ? "Creating..."
              : "Create Project"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="center-message">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="center-message">
          <h3>Loading projects...</h3>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {projects.length === 0 ? (
            <div
              className="card"
              style={{
                marginTop: "25px",
                textAlign: "center",
              }}
            >
              <h3>No projects found</h3>

              <p
                style={{
                  marginTop: "10px",
                  color: "#6b7280",
                }}
              >
                Create your first project to get
                started.
              </p>
            </div>
          ) : (
            <div
              className="grid grid-3"
              style={{ marginTop: "25px" }}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="card"
                >
                  <h2>{project.name}</h2>

                  <p
                    style={{
                      marginTop: "12px",
                      color: "#6b7280",
                    }}
                  >
                    Manage tasks and team
                    collaboration efficiently.
                  </p>

                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <span className="badge progress">
                      Active Project
                    </span>
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