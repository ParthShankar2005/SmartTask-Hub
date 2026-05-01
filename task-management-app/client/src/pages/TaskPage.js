import TaskItem from "../components/TaskItem";

function TaskPage() {
  const sampleTasks = [{ title: "Sample Task", description: "Task page scaffold", status: "todo" }];

  return (
    <section className="container">
      <h2>Tasks</h2>
      <ul className="task-list">
        {sampleTasks.map((task) => (
          <TaskItem key={task.title} task={task} />
        ))}
      </ul>
    </section>
  );
}

export default TaskPage;
