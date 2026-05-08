import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div>
      <h5>Dashboard Page</h5>
      <button onClick={handleLogout}>Logout</button>

      <hr />
      {tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        tasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title} </h3>
            <p>{task.description}</p>
            <p>Status:{task.status}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
