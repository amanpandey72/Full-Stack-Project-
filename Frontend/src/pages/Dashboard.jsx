import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard");

      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="center-message">
        <h3>Loading dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center-message">
        <h3 style={{ color: "red" }}>{error}</h3>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: "25px" }}>
        Dashboard Overview
      </h1>

      {/* Top Stats */}
      <div className="grid grid-3">
        <div className="card">
          <h3>Total Tasks</h3>

          <h1 style={{ color: "#2563eb" }}>
            {data.totalTasks}
          </h1>
        </div>

        <div className="card">
          <h3>Overdue Tasks</h3>

          <h1 style={{ color: "#ef4444" }}>
            {data.overdue}
          </h1>
        </div>

        <div className="card">
          <h3>Completed Tasks</h3>

          <h1 style={{ color: "#16a34a" }}>
            {data.status.done}
          </h1>
        </div>
      </div>

      {/* Status Section */}
      <div
        className="card"
        style={{ marginTop: "25px" }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Task Status
        </h2>

        <div className="grid grid-3">
          <div>
            <span className="badge todo">
              To Do
            </span>

            <h2 style={{ marginTop: "12px" }}>
              {data.status.todo}
            </h2>
          </div>

          <div>
            <span className="badge progress">
              In Progress
            </span>

            <h2 style={{ marginTop: "12px" }}>
              {data.status.inProgress}
            </h2>
          </div>

          <div>
            <span className="badge done">
              Done
            </span>

            <h2 style={{ marginTop: "12px" }}>
              {data.status.done}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}