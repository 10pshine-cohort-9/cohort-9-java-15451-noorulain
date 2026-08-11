import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contactService";
import "../styles/dashboard.css";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  address: "",
};

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      const response = await getContacts();

      const data =
        response?.data ||
        response?.contacts ||
        response ||
        [];

      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(contact) {
    setEditingId(contact.id);

    setForm({
      firstName: contact.firstName || "",
      lastName: contact.lastName || "",
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      address: contact.address || "",
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.phone) {
      setError("First name, last name and phone are required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateContact(editingId, form);
      } else {
        await createContact(form);
      }

      closeForm();
      await loadContacts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save contact. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) return;

    try {
      await deleteContact(id);
      await loadContacts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to delete contact."
      );
    }
  }

  const filteredContacts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return contacts;

    return contacts.filter((contact) =>
      [
        contact.firstName,
        contact.lastName,
        contact.email,
        contact.phone,
        contact.company,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        )
    );
  }, [contacts, search]);

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">C</div>
          <span>ContactHub</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/contacts" className="nav-item active">
            <span>☷</span>
            Contacts
          </Link>
        </nav>

        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <p className="welcome-label">Contact management</p>
            <h1>Contacts</h1>
          </div>

          <button
            className="add-contact-button"
            onClick={openAddForm}
          >
            + Add Contact
          </button>
        </header>

        {error && (
          <div className="contact-error">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="contacts-toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name, email, phone or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="contact-count">
            {filteredContacts.length} contact
            {filteredContacts.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Contacts */}
        <section className="contacts-card">

          {loading ? (
            <div className="empty-state">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>

              <h3>
                {search
                  ? "No contacts found"
                  : "No contacts yet"}
              </h3>

              <p>
                {search
                  ? "Try searching for something else."
                  : "Add your first contact to get started."}
              </p>

              {!search && (
                <button
                  className="empty-button"
                  onClick={openAddForm}
                >
                  Add Contact
                </button>
              )}
            </div>
          ) : (
            <div className="contacts-table-wrapper">
              <table className="contacts-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id}>

                      <td>
                        <div className="table-name">
                          <div className="contact-avatar">
                            {(contact.firstName?.[0] || "C").toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {contact.firstName}{" "}
                              {contact.lastName}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        {contact.email || "—"}
                      </td>

                      <td>
                        {contact.phone || "—"}
                      </td>

                      <td>
                        {contact.company || "—"}
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditForm(contact)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(contact.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

      </main>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="contact-modal">

            <div className="modal-header">
              <div>
                <h2>
                  {editingId
                    ? "Edit Contact"
                    : "Add Contact"}
                </h2>

                <p>
                  {editingId
                    ? "Update contact information."
                    : "Add a new contact to your list."}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="contact-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="modal-form-grid">

                <div className="form-group">
                  <label>First name *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                  />
                </div>

                <div className="form-group">
                  <label>Last name *</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03001234567"
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>

              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Contact"
                    : "Add Contact"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}