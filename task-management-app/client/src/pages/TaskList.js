import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFilter, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { addTask, deleteTask, getTasks, isUnauthorizedError, updateTask } from "../services/taskService";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const getApiErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || fallbackMessage;

function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formMode, setFormMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getTasks(token);
      setTasks(data);
      setErrorMessage("");
      setHasLoadError(false);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.removeItem("token");
        setErrorMessage("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setErrorMessage(getApiErrorMessage(error, "Failed to load tasks. Try again."));
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timer = setTimeout(() => setSuccessMessage(""), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "all") {
      return tasks;
    }
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const openCreateForm = () => {
    setFormMode("create");
    setSelectedTask(null);
    setIsFormOpen(true);
    setErrorMessage("");
    setHasLoadError(false);
  };

  const openEditForm = (task) => {
    setFormMode("edit");
    setSelectedTask(task);
    setIsFormOpen(true);
    setErrorMessage("");
    setHasLoadError(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const requireToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("Login is required to modify tasks.");
      navigate("/login");
      return null;
    }
    return token;
  };

  const onSaveTask = async (payload) => {
    const token = requireToken();
    if (!token) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setHasLoadError(false);

    try {
      if (formMode === "edit" && selectedTask?._id) {
        await updateTask(selectedTask._id, payload, token);
        setSuccessMessage("Task updated successfully.");
      } else {
        await addTask(payload, token);
        setSuccessMessage("Task created successfully.");
      }

      closeForm();
      await loadTasks();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.removeItem("token");
        setErrorMessage("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setErrorMessage(getApiErrorMessage(error, "Task save failed. Please retry."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteTask = async (task) => {
    const token = requireToken();
    if (!token) {
      return;
    }

    if (!window.confirm(`Delete "${task.title}"?`)) {
      return;
    }

    setActiveTaskId(task._id);
    setErrorMessage("");
    setHasLoadError(false);

    try {
      await deleteTask(task._id, token);
      setSuccessMessage("Task deleted.");
      await loadTasks();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.removeItem("token");
        setErrorMessage("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setErrorMessage(getApiErrorMessage(error, "Task deletion failed."));
    } finally {
      setActiveTaskId("");
    }
  };

  const onMarkCompleted = async (task) => {
    if (task.status === "completed") {
      return;
    }

    const token = requireToken();
    if (!token) {
      return;
    }

    setActiveTaskId(task._id);
    setErrorMessage("");
    setHasLoadError(false);

    try {
      await updateTask(task._id, { status: "completed" }, token);
      setSuccessMessage("Task marked as completed.");
      await loadTasks();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        localStorage.removeItem("token");
        setErrorMessage("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      setErrorMessage(getApiErrorMessage(error, "Status update failed."));
    } finally {
      setActiveTaskId("");
    }
  };

  return (
    <section className="task-shell container py-4">
      <div className="task-shell-header mb-4">
        <div>
          <p className="task-kicker mb-2">Task Control Center</p>
          <h2 className="mb-1">Plan, track, and finish work</h2>
          <p className="task-subtitle mb-0">Manage task lifecycle with quick add, edit, and status actions.</p>
        </div>
        <button className="btn btn-primary add-task-btn" type="button" onClick={openCreateForm}>
          <FaPlus className="me-2" />
          Add Task
        </button>
      </div>

      <div className="task-toolbar mb-3">
        <div className="d-flex align-items-center gap-2">
          <FaFilter />
          <span>Filter</span>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`btn btn-sm ${
                statusFilter === filter.value ? "btn-dark" : "btn-outline-secondary"
              }`}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span>{errorMessage}</span>
            {hasLoadError && (
              <button className="btn btn-sm btn-outline-danger" type="button" onClick={loadTasks}>
                Retry
              </button>
            )}
          </div>
        </div>
      )}
      {successMessage && (
        <div className="alert alert-success shadow-sm" role="status">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="task-loading-wrap">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading tasks...</span>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="task-empty-state">
          <h3 className="mb-2">No tasks in this view</h3>
          <p className="mb-0">Create a new task or switch filter to see more items.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              isBusy={isSubmitting || activeTaskId === task._id}
              onEdit={openEditForm}
              onDelete={onDeleteTask}
              onMarkCompleted={onMarkCompleted}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={isFormOpen}
        mode={formMode}
        task={selectedTask}
        isSaving={isSubmitting}
        onCancel={closeForm}
        onSave={onSaveTask}
      />
    </section>
  );
}

export default TaskList;
