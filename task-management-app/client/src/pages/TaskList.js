import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFilter, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import { getAuthToken, logoutUser } from "../services/authService";
import { addTask, deleteTask, getTasks, isUnauthorizedError, updateTask } from "../services/taskService";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "due-date", label: "Due Date (Closest First)" },
];

const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error?.response) {
    return "Backend is unreachable right now. Please check your network and retry.";
  }

  const apiMessage = error.response.data?.message;
  if (typeof apiMessage === "string" && apiMessage.includes("buffering timed out")) {
    return "Backend database is temporarily unavailable. Please retry shortly.";
  }

  return apiMessage || fallbackMessage;
};

const toTimeValue = (value) => {
  if (!value) {
    return null;
  }

  const parsedTime = new Date(value).getTime();
  return Number.isNaN(parsedTime) ? null : parsedTime;
};

function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState("create");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hasLoadError, setHasLoadError] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const data = await getTasks(token);
      setTasks(data);
      setErrorMessage("");
      setHasLoadError(false);
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logoutUser();
        setErrorMessage("Session expired. Please login again.");
        navigate("/login", { state: { message: "Session expired. Please login again." } });
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

  const visibleTasks = useMemo(() => {
    let result = [...tasks];

    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (normalizedSearch) {
      result = result.filter((task) => {
        const title = task.title?.toLowerCase() || "";
        const description = task.description?.toLowerCase() || "";
        return title.includes(normalizedSearch) || description.includes(normalizedSearch);
      });
    }

    result.sort((taskA, taskB) => {
      const createdA = toTimeValue(taskA.createdAt) || 0;
      const createdB = toTimeValue(taskB.createdAt) || 0;

      if (sortBy === "oldest") {
        return createdA - createdB;
      }

      if (sortBy === "due-date") {
        const dueA = toTimeValue(taskA.dueDate);
        const dueB = toTimeValue(taskB.dueDate);

        if (dueA === null && dueB === null) {
          return createdB - createdA;
        }
        if (dueA === null) {
          return 1;
        }
        if (dueB === null) {
          return -1;
        }
        return dueA - dueB;
      }

      return createdB - createdA;
    });

    return result;
  }, [tasks, statusFilter, sortBy, searchTerm]);

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
    const token = getAuthToken();
    if (!token) {
      setErrorMessage("Login is required to modify tasks.");
      closeForm();
      navigate("/login", { state: { message: "Please login to continue." } });
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
        const updatedTask = await updateTask(selectedTask._id, payload, token);
        setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
        setSuccessMessage("Task updated successfully.");
      } else {
        const createdTask = await addTask(payload, token);
        setTasks((prev) => [createdTask, ...prev]);
        setSuccessMessage("Task created successfully.");
      }

      closeForm();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logoutUser();
        setErrorMessage("Session expired. Please login again.");
        navigate("/login", { state: { message: "Session expired. Please login again." } });
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
      setTasks((prev) => prev.filter((item) => item._id !== task._id));
      setSuccessMessage("Task deleted.");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logoutUser();
        setErrorMessage("Session expired. Please login again.");
        navigate("/login", { state: { message: "Session expired. Please login again." } });
        return;
      }
      setErrorMessage(getApiErrorMessage(error, "Task deletion failed."));
    } finally {
      setActiveTaskId("");
    }
  };

  const onStatusChange = async (task, nextStatus) => {
    if (task.status === nextStatus) {
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
      const updatedTask = await updateTask(task._id, { status: nextStatus }, token);
      setTasks((prev) => prev.map((item) => (item._id === updatedTask._id ? updatedTask : item)));
      setSuccessMessage("Task status updated.");
    } catch (error) {
      if (isUnauthorizedError(error)) {
        logoutUser();
        setErrorMessage("Session expired. Please login again.");
        navigate("/login", { state: { message: "Session expired. Please login again." } });
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

      <div className="task-toolbar mb-3">
        <div className="task-search-wrap">
          <FaSearch className="text-muted" />
          <input
            className="form-control task-search-input"
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sort-select" className="mb-0 small text-muted">
            Sort
          </label>
          <select
            id="sort-select"
            className="form-select form-select-sm task-sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
      ) : visibleTasks.length === 0 ? (
        <div className="task-empty-state">
          <h3 className="mb-2">{searchTerm ? "No Results Found" : "No tasks in this view"}</h3>
          <p className="mb-0">
            {searchTerm
              ? "Try a different keyword or clear search to view all tasks."
              : "Create a new task or switch filter to see more items."}
          </p>
        </div>
      ) : (
        <div className="task-grid">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              searchTerm={searchTerm}
              isBusy={isSubmitting || activeTaskId === task._id}
              onEdit={openEditForm}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
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
