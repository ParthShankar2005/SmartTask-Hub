function TaskItem({ task }) {
  const badgeClass =
    task.status === "completed"
      ? "bg-success"
      : task.status === "in-progress"
      ? "bg-warning text-dark"
      : "bg-secondary";

  return (
    <li className="task-item list-group-item shadow-sm mb-2 rounded">
      <h5 className="mb-2">{task.title}</h5>
      <p className="mb-2 text-muted">{task.description || "No description provided."}</p>
      <span className={`badge ${badgeClass}`}>{task.status}</span>
    </li>
  );
}

export default TaskItem;
