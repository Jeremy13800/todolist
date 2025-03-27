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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-fuchsia-900 to-pink-700">
      {/* Grille rétro */}
      <div className="absolute inset-0 bg-grid-white/10"></div>

      <div className="relative max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-center mb-12">
          <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            RETRO TASKS
          </span>
        </h1>

        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8 shadow-[0_0_15px_rgba(255,0,255,0.3)]">
          <div className="flex items-center gap-4">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="NEW MISSION..."
              className="w-full bg-black/50 text-pink-500 placeholder-pink-500/50 border-2 border-pink-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <button
              onClick={handleAddTask}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-[0_0_10px_rgba(255,0,255,0.5)]"
            >
              ADD
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center text-cyan-400 text-2xl font-bold animate-pulse">
            <p>[ SYSTEM IDLE ]</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between p-4">
                  <div
                    onClick={() => handleToggleTask(task._id)}
                    className="flex items-center gap-4 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-300 
                      ${
                        task.completed
                          ? "border-cyan-400 bg-cyan-400/20"
                          : "border-pink-500"
                      }`}
                    >
                      {task.completed && (
                        <span className="text-cyan-400">✓</span>
                      )}
                    </div>
                    <span
                      className={`font-bold transition-all duration-300
                      ${
                        task.completed
                          ? "text-cyan-400 line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-4 py-2 text-pink-500 hover:text-white hover:bg-pink-500 rounded transition-all duration-300"
                  >
                    [ DELETE ]
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
