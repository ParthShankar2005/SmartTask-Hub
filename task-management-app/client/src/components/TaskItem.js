import { FaCheckCircle, FaEdit, FaRegClock, FaTrashAlt } from "react-icons/fa";

const getStatusMeta = (status) => {
  if (status === "completed") {
    return { className: "bg-success-subtle text-success-emphasis", label: "Completed" };
  }

  if (status === "in-progress") {
    return { className: "bg-warning-subtle text-warning-emphasis", label: "In Progress" };
  }

  return { className: "bg-secondary-subtle text-secondary-emphasis", label: "Pending" };
};

const formatDueDate = (dueDate) => {
  if (!dueDate) {
    return "No due date";
  }

  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) {
    return "Invalid due date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (text, searchTerm) => {
  if (!searchTerm?.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegex(searchTerm.trim())})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="task-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
};

function TaskItem({ task, searchTerm, isBusy, onEdit, onDelete, onStatusChange }) {
  const statusMeta = getStatusMeta(task.status);
  const taskDescription = task.description || "No description provided.";

  return (
    <article className={`task-item-card ${task.status === "completed" ? "is-complete" : ""}`}>
      <div className="d-flex justify-content-between gap-3 mb-2">
        <h5 className="mb-0 fw-semibold task-item-title">{highlightText(task.title, searchTerm)}</h5>
        <span className={`badge ${statusMeta.className}`}>{statusMeta.label}</span>
      </div>
      <p className="task-item-description mb-3">{highlightText(taskDescription, searchTerm)}</p>
      <p className="task-item-due mb-3 d-flex align-items-center gap-2">
        <FaRegClock />
        <span>{formatDueDate(task.dueDate)}</span>
      </p>
      <div className="mb-3">
        <label htmlFor={`status-${task._id}`} className="form-label small mb-1">
          Status
        </label>
        <select
          id={`status-${task._id}`}
          className="form-select form-select-sm task-item-status-select"
          value={task.status}
          disabled={isBusy}
          onChange={(event) => onStatusChange(task, event.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => onEdit(task)}>
          <FaEdit className="me-1" />
          Edit
        </button>
        <button
          className="btn btn-outline-success btn-sm"
          type="button"
          disabled={isBusy || task.status === "completed"}
          onClick={() => onStatusChange(task, "completed")}
        >
          <FaCheckCircle className="me-1" />
          {task.status === "completed" ? "Completed" : "Mark Complete"}
        </button>
        <button
          className="btn btn-outline-danger btn-sm ms-auto"
          type="button"
          disabled={isBusy}
          onClick={() => onDelete(task)}
        >
          <FaTrashAlt className="me-1" />
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskItem;
