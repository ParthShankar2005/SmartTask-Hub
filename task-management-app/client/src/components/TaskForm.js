import { useEffect, useMemo, useState } from "react";
import Button from "./Button";

const getDefaultFormData = () => ({
  title: "",
  description: "",
  status: "pending",
  dueDate: "",
});

const mapTaskToFormData = (task) => {
  if (!task) {
    return getDefaultFormData();
  }

  const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "";

  return {
    title: task.title || "",
    description: task.description || "",
    status: task.status || "pending",
    dueDate,
  };
};

function TaskForm({ isOpen, mode, task, isSaving, onCancel, onSave }) {
  const [formData, setFormData] = useState(getDefaultFormData());
  const [validationError, setValidationError] = useState("");

  const dialogTitle = useMemo(() => (mode === "edit" ? "Edit Task" : "Add New Task"), [mode]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData(mapTaskToFormData(task));
    setValidationError("");
  }, [isOpen, task]);

  if (!isOpen) {
    return null;
  }

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!formData.title.trim()) {
      setValidationError("Task title is required.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate || undefined,
    };

    await onSave(payload);
  };

  return (
    <div className="task-modal-backdrop" role="dialog" aria-modal="true" aria-label={dialogTitle}>
      <div className="task-modal-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">{dialogTitle}</h3>
          <button className="btn btn-sm btn-outline-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={onChange}
              placeholder="Example: Prepare sprint demo"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={onChange}
              placeholder="Optional notes for this task..."
            />
          </div>
          <div className="row g-3 mb-3">
            <div className="col-sm-6">
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={onChange}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="col-sm-6">
              <label htmlFor="dueDate" className="form-label">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-control"
                value={formData.dueDate}
                onChange={onChange}
              />
            </div>
          </div>
          {validationError && <p className="text-danger mb-3">{validationError}</p>}
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
