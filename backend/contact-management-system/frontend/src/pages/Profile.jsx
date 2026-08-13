import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.currentPassword ||
      !form.newPassword ||
      !form.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    if (form.currentPassword === form.newPassword) {
      alert("New password must be different from current password.");
      return;
    }

    if (!token) {
      alert("You are not logged in. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/profile/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password."
        );
      }

      alert("Password changed successfully.");

      setShowModal(false);

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim();

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

        <button
          className="logout-button"
          onClick={handleLogout}
        >
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
                value={fullName}
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
                disabled={loading}
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
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  minLength="6"
                  required
                />
              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={loading}
                >
                  {loading
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}