import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section className="container py-5">
      <div className="home-hero">
        <p className="task-kicker mb-2">Workflow Dashboard</p>
        <h1 className="home-title mb-3">Ship priorities without losing momentum</h1>
        <p className="home-subtitle mb-4">
          Capture tasks, update status instantly, and keep your daily work focused.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-dark" to="/tasks">
            Open Task Board
          </Link>
          <Link className="btn btn-outline-dark" to="/login">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
