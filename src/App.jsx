import { useState, useEffect } from "react";
import "./app.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch(`/api/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  function handleAddTask() {
    if (!newTask.trim()) return;
    fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTask, completed: false }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTask("");
      });
  }

  function handleToggleTask(id) {
    const task = tasks.find((t) => t._id === id);
    fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
      });
  }

  function handleDeleteTask(id) {
    fetch(`/api/tasks/${id}`, { method: "DELETE" }).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="neon-grid"></div>
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="cyber-glitch-text text-6xl font-black mb-8">
          <span data-text="CYBER">CYBER</span>
          <span data-text="TASKS">TASKS</span>
        </h1>

        <div className="cyber-card mb-8">
          <div className="cyber-card-border"></div>
          <div className="flex items-center gap-4 p-2">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter your mission..."
              className="cyber-input"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button onClick={handleAddTask} className="cyber-button">
              <span className="cyber-button-text">ADD</span>
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="cyber-empty">
            <div className="cyber-scanner"></div>
            <p className="text-2xl text-cyan-400">System awaiting input...</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task._id} className="cyber-task">
                <div className="cyber-task-content">
                  <div
                    onClick={() => handleToggleTask(task._id)}
                    className="flex items-center gap-4 cursor-pointer"
                  >
                    <div
                      className={`cyber-checkbox ${
                        task.completed ? "completed" : ""
                      }`}
                    >
                      {task.completed && <span>✓</span>}
                    </div>
                    <span
                      className={
                        task.completed
                          ? "text-cyan-400 line-through"
                          : "text-white"
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="cyber-delete"
                  >
                    DELETE
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
