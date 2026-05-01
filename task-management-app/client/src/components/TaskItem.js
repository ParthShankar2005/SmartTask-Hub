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

  return new Date(dueDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function TaskItem({ task, isBusy, onEdit, onDelete, onMarkCompleted }) {
  const statusMeta = getStatusMeta(task.status);

  return (
    <article className={`task-item-card ${task.status === "completed" ? "is-complete" : ""}`}>
      <div className="d-flex justify-content-between gap-3 mb-2">
        <h5 className="mb-0 fw-semibold">{task.title}</h5>
        <span className={`badge ${statusMeta.className}`}>{statusMeta.label}</span>
      </div>
      <p className="task-item-description mb-3">{task.description || "No description provided."}</p>
      <p className="task-item-due mb-3 d-flex align-items-center gap-2">
        <FaRegClock />
        <span>{formatDueDate(task.dueDate)}</span>
      </p>
      <div className="d-flex flex-wrap gap-2">
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => onEdit(task)}>
          <FaEdit className="me-1" />
          Edit
        </button>
        <button
          className="btn btn-outline-success btn-sm"
          type="button"
          disabled={isBusy || task.status === "completed"}
          onClick={() => onMarkCompleted(task)}
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
