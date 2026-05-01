const request = require("supertest");
const app = require("../app");

const registerAndLogin = async () => {
  const email = `user${Date.now()}@example.com`;
  const password = "StrongPass123";

  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password,
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  return {
    token: loginResponse.body.token,
    userId: loginResponse.body.user.id,
  };
};

describe("API Integration", () => {
  test("GET / returns server health response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Task Management API is running." });
  });

  test("register and login return JWT tokens", async () => {
    const email = `auth${Date.now()}@example.com`;
    const password = "StrongPass123";

    const registerResponse = await request(app).post("/api/auth/register").send({
      name: "Auth User",
      email,
      password,
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.token).toBeDefined();
    expect(registerResponse.body.user.email).toBe(email);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email,
      password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.user.email).toBe(email);
  });

  test("duplicate registration returns 409", async () => {
    const email = `dup${Date.now()}@example.com`;
    const payload = {
      name: "Duplicate User",
      email,
      password: "StrongPass123",
    };

    await request(app).post("/api/auth/register").send(payload);
    const duplicateResponse = await request(app).post("/api/auth/register").send(payload);

    expect(duplicateResponse.status).toBe(409);
    expect(duplicateResponse.body.message).toBe("User already exists.");
  });

  test("invalid login returns 401", async () => {
    const email = `login${Date.now()}@example.com`;

    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email,
      password: "StrongPass123",
    });

    const response = await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials.");
  });

  test("protected task routes reject requests without token", async () => {
    const createResponse = await request(app).post("/api/tasks").send({
      title: "Unauthorized task",
    });

    expect(createResponse.status).toBe(401);
    expect(createResponse.body.message).toBe("Authorization token is required.");

    const listResponse = await request(app).get("/api/tasks");
    expect(listResponse.status).toBe(401);
    expect(listResponse.body.message).toBe("Authorization token is required.");
  });

  test("task CRUD works with valid JWT token", async () => {
    const { token, userId } = await registerAndLogin();
    const authHeader = { Authorization: `Bearer ${token}` };

    const createResponse = await request(app).post("/api/tasks").set(authHeader).send({
      title: "Write API tests",
      description: "Create task from test",
      status: "pending",
    });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe("Write API tests");
    expect(createResponse.body.status).toBe("pending");
    expect(createResponse.body.user).toBe(userId);
    const taskId = createResponse.body._id;

    const getResponse = await request(app).get("/api/tasks").set(authHeader);
    expect(getResponse.status).toBe(200);
    expect(Array.isArray(getResponse.body)).toBe(true);
    expect(getResponse.body.some((task) => task._id === taskId)).toBe(true);

    const updateResponse = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(authHeader)
      .send({ status: "completed" });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.status).toBe("completed");

    const deleteResponse = await request(app).delete(`/api/tasks/${taskId}`).set(authHeader);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe("Task deleted successfully.");
  });

  test("task validation and edge cases return expected errors", async () => {
    const { token } = await registerAndLogin();
    const authHeader = { Authorization: `Bearer ${token}` };

    const invalidStatusResponse = await request(app).post("/api/tasks").set(authHeader).send({
      title: "Invalid status task",
      status: "invalid-status",
    });

    expect(invalidStatusResponse.status).toBe(400);
    expect(invalidStatusResponse.body.message).toContain("`invalid-status` is not a valid enum value");

    const invalidIdUpdate = await request(app).put("/api/tasks/123").set(authHeader).send({
      title: "x",
    });
    expect(invalidIdUpdate.status).toBe(400);
    expect(invalidIdUpdate.body.message).toBe("Invalid task ID.");

    const missingTaskDelete = await request(app)
      .delete("/api/tasks/507f1f77bcf86cd799439011")
      .set(authHeader);
    expect(missingTaskDelete.status).toBe(404);
    expect(missingTaskDelete.body.message).toBe("Task not found or not authorized.");
  });

  test("users cannot update or delete tasks they do not own", async () => {
    const ownerSession = await registerAndLogin();
    const otherSession = await registerAndLogin();

    const ownerHeader = { Authorization: `Bearer ${ownerSession.token}` };
    const otherHeader = { Authorization: `Bearer ${otherSession.token}` };

    const createResponse = await request(app).post("/api/tasks").set(ownerHeader).send({
      title: "Owner-only task",
      status: "pending",
    });

    expect(createResponse.status).toBe(201);
    const taskId = createResponse.body._id;

    const unauthorizedUpdate = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set(otherHeader)
      .send({ status: "completed" });

    expect(unauthorizedUpdate.status).toBe(404);
    expect(unauthorizedUpdate.body.message).toBe("Task not found or not authorized.");

    const unauthorizedDelete = await request(app).delete(`/api/tasks/${taskId}`).set(otherHeader);

    expect(unauthorizedDelete.status).toBe(404);
    expect(unauthorizedDelete.body.message).toBe("Task not found or not authorized.");
  });
});
