import { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem";
import Button from "../components/Button";
import { createTask, getTasks } from "../services/taskService";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (_error) {
      setError("Failed to load tasks.");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const createSampleTask = async () => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      await createTask(
        {
          title: `Sample Task ${tasks.length + 1}`,
          description: "Created from React frontend",
          status: "pending",
        },
        token
      );
      await loadTasks();
    } catch (_error) {
      setError("Task creation failed. Login first to create tasks.");
    }
  };

  return (
    <section className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Tasks</h2>
        <Button onClick={createSampleTask}>Create Sample Task</Button>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <ul className="task-list list-group">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </ul>
    </section>
  );
}

export default TaskPage;
