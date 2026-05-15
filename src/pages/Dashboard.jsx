import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      // 1.5 sec delay for test slownetwork only not for production
      // await new Promise((resolve) => setTimeout(resolve, 1500))

      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      // console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, formData);
        setEditingTaskId(null);
      } else {
        await api.post("/tasks", formData);
      }

      setFormData({
        title: "",
        description: "",
        status: "pending",
      });
      fetchTasks();
    } catch (error) {
      // console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Task save Failed");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      // console.log(error.response?.data || error.message);
      setError(error.response?.data?.message || "Task delete Failed");
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h5>Dashboard </h5>
      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>{editingTaskId ? "Edit Task" : "Create Task"}</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <br />

        <button type="submit">
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </form>

      {editingTaskId && (
        <button
          onClick={() => {
            setEditingTaskId(null);
            setFormData({
              title: "",
              description: "",
              status: "pending",
            });
          }}
        >
          Cancel Edit
        </button>
      )}

      <hr />

      <h2>My Tasks</h2>

      {loading ? (
        <p>Loading Taks... </p>
      ) : tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title} </h3>
            <p>{task.description}</p>
            <p>Status:{task.status}</p>

            <div className="task-actions">
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </div>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
