import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const STATUSES = ["todo", "in_progress", "done"];

const nextStatus = {
  todo: "in_progress",
  in_progress: "done",
  done: "done",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
  });

  async function loadBoard() {
    try {
      setLoading(true);
      setError("");
      const [tasksRes, summaryRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks`),
        fetch(`${API_BASE_URL}/summary`),
      ]);

      if (!tasksRes.ok || !summaryRes.ok) {
        throw new Error("Could not load task board data.");
      }

      const [tasksData, summaryData] = await Promise.all([
        tasksRes.json(),
        summaryRes.json(),
      ]);

      setTasks(tasksData);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  async function handleCreateTask(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      setError("Could not create task.");
      return;
    }

    setForm({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
    });
    await loadBoard();
  }

  async function advanceTask(task) {
    const updatedStatus = nextStatus[task.status];
    if (updatedStatus === task.status) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: updatedStatus }),
    });

    if (!response.ok) {
      setError("Could not update task.");
      return;
    }

    await loadBoard();
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Demo Frontend Repo</p>
          <h1>Team Task Board</h1>
          <p className="subtitle">
            A simple workflow board that talks to the paired FastAPI backend.
          </p>
        </div>
        <div className="summary-card">
          <h2>Board Snapshot</h2>
          {summary ? (
            <ul>
              <li>Total tasks: {summary.total}</li>
              <li>To do: {summary.todo}</li>
              <li>In progress: {summary.in_progress}</li>
              <li>Done: {summary.done}</li>
            </ul>
          ) : (
            <p>No summary yet.</p>
          )}
        </div>
      </section>

      <section className="layout">
        <form className="panel task-form" onSubmit={handleCreateTask}>
          <h2>Create Task</h2>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </label>
          <label>
            Assignee
            <input
              value={form.assignee}
              onChange={(event) =>
                setForm({ ...form, assignee: event.target.value })
              }
            />
          </label>
          <label>
            Priority
            <select
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: event.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <button type="submit">Add Task</button>
        </form>

        <section className="board">
          {loading ? <p className="panel">Loading board…</p> : null}
          {error ? <p className="panel error">{error}</p> : null}

          {!loading && !error
            ? STATUSES.map((status) => (
                <div className="panel column" key={status}>
                  <h2>{status.replace("_", " ")}</h2>
                  <div className="task-list">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <article className="task-card" key={task.id}>
                          <div className="task-meta">
                            <span className={`priority ${task.priority}`}>
                              {task.priority}
                            </span>
                            <span>{task.assignee}</span>
                          </div>
                          <h3>{task.title}</h3>
                          <p>{task.description}</p>
                          <button onClick={() => advanceTask(task)}>
                            {task.status === "done" ? "Completed" : "Move Forward"}
                          </button>
                        </article>
                      ))}
                  </div>
                </div>
              ))
            : null}
        </section>
      </section>
    </main>
  );
}

export default App;
