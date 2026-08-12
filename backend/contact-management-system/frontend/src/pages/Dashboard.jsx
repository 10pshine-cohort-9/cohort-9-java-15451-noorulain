
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContacts } from "../services/contactService";
import { logout } from "../services/authService";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    console.error("Unable to read user data from local storage.");
    user = {};
  }

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    setLoading(true);
    setLoadError(false);

    try {
      const response = await getContacts();

      const data =
        response?.data ||
        response?.contacts ||
        response ||
        [];

      setContacts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load contacts.");
      setContacts([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    window.location.href = "/login";
  }

  const totalContacts = contacts.length;

  const recentContacts = [...contacts]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="dashboard-layout">
    {/* Sidebar */}
<aside className="sidebar">
  <div className="sidebar-brand">
    <div className="sidebar-logo">C</div>
    <span>ContactHub</span>
  </div>

  <nav className="sidebar-nav">
   <Link to="/dashboard" className="nav-item active">
      <span>▦</span>
      Dashboard
    </Link>

  <Link to="/contacts" className="nav-item">
      <span>☷</span>
      Contacts
    </Link>

    <Link to="/profile" className="nav-item">
      <span>👤</span>
      Profile
    </Link>
  </nav>

 <button
  className="logout-button"
  onClick={handleLogout}
 >
  
    <span>↪</span>
    Logout
  </button>
</aside>

        

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="welcome-label">Welcome back 👋</p>
            <h1>
              {user?.firstName
                ? `${user.firstName} ${user.lastName || ""}`
                : "Dashboard"}
            </h1>
          </div>

          <Link to="/contacts" className="add-contact-button">
            + Add Contact
          </Link>
        </header>

        {/* Stats */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">◉</div>
            <div>
              <p>Total Contacts</p>
              <h2>{loading ? "—" : totalContacts}</h2>
            </div>
          </div>
<section className="quick-actions">
  <Link to="/contacts" className="quick-card">
    <h3>Manage Contacts</h3>
    <p>View, edit and organize all your contacts.</p>
  </Link>
</section>
          <div className="stat-card">
            <div className="stat-icon blue">✓</div>
            <div>
              <p>Active Contacts</p>
              <h2>{loading ? "—" : totalContacts}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">+</div>
            <div>
              <p>Recently Added</p>
              <h2>{loading ? "—" : Math.min(totalContacts, 5)}</h2>
            </div>
          </div>
        </section>

        {/* Recent Contacts */}
        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Recent Contacts</h2>
              <p>Your latest contacts</p>
            </div>

            <Link to="/contacts" className="view-all">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading contacts...
            </div>
          ) : loadError ? (
            <div className="empty-state">
              <div className="empty-icon">⚠</div>
              <h3>Unable to load contacts</h3>
              <p>
                Something went wrong while loading your contacts.
                Please try again.
              </p>

              <button
                type="button"
                className="empty-button"
                onClick={loadContacts}
              >
                Try again
              </button>
            </div>
          ) : recentContacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <h3>No contacts yet</h3>
              <p>
                Start building your contact list by adding your first contact.
              </p>

              <Link to="/contacts" className="empty-button">
                Add your first contact
              </Link>
            </div>
          ) : (
            <div className="contact-list">
              {recentContacts.map((contact) => (
                <div className="contact-row" key={contact.id}>
                  <div className="contact-avatar">
                    {(contact.firstName?.[0] || "C").toUpperCase()}
                  </div>

                  <div className="contact-info">
                    <strong>
                      {contact.firstName} {contact.lastName}
                    </strong>
                    <span>{contact.email || "No email"}</span>
                  </div>

                  <div className="contact-phone">
                    {contact.phone || "No phone"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
