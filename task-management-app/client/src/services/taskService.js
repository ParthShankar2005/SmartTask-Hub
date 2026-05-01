const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getTasks = async () => {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks.");
  }
  return response.json();
};

const createTask = async (taskPayload) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskPayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create task.");
  }

  return response.json();
};

export { getTasks, createTask };
