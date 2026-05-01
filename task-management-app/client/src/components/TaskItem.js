function TaskItem({ task }) {
  return (
    <li className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description || "No description provided."}</p>
      <span>Status: {task.status}</span>
    </li>
  );
}

export default TaskItem;
