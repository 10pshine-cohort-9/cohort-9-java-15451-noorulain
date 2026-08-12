import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showModal, setShowModal] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password change feature will be connected to backend.");

    setShowModal(false);

    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  return (
    <div className="dashboard-layout">

      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">C</div>
          <span>ContactHub</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>

          <Link to="/contacts" className="nav-item">
            Contacts
          </Link>

          <Link to="/profile" className="nav-item active">
            Profile
          </Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="welcome-label">User Account</p>
            <h1>Profile</h1>
          </div>

          <button
            className="add-contact-button"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </button>
        </header>

        <div className="contacts-card">
          <h2>User Information</h2>

          <div className="modal-form-grid">

            <div className="form-group">
              <label>Name</label>
              <input
                value={user.name || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                value={user.email || ""}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                value={user.phone || ""}
                disabled
              />
            </div>

          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="contact-modal">

            <div className="modal-header">
              <h2>Change Password</h2>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  Change Password
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}