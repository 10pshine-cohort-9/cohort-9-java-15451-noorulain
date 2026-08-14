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
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getContacts();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setContacts(data);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (contact) => {
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
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateContact(editingId, form);
        setSuccess("Contact updated successfully.");
      } else {
        await createContact(form);
        setSuccess("Contact created successfully.");
      }

      await loadContacts();

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error saving contact:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to save contact."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteContact(id);

      setSuccess("Contact deleted successfully.");

      await loadContacts();

      const remainingContacts = filteredContacts.length - 1;
      const maxPage = Math.max(
        1,
        Math.ceil(remainingContacts / contactsPerPage)
      );

      setCurrentPage((page) => Math.min(page, maxPage));
    } catch (err) {
      console.error("Error deleting contact:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete contact."
      );
    }
  };

  const filteredContacts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const fullName =
        `${contact.firstName || ""} ${contact.lastName || ""}`.toLowerCase();

      return (
        fullName.includes(searchValue) ||
        (contact.email || "").toLowerCase().includes(searchValue) ||
        (contact.phone || "").toLowerCase().includes(searchValue) ||
        (contact.company || "").toLowerCase().includes(searchValue) ||
        (contact.address || "").toLowerCase().includes(searchValue)
      );
    });
  }, [contacts, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContacts.length / contactsPerPage)
  );

  const startIndex = (currentPage - 1) * contactsPerPage;

  const currentContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <Link to="/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>

            <h1>Manage Contacts</h1>

            <p>
              View, add, edit and organize your contacts.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={openAddForm}
          >
            + Add Contact
          </button>
        </div>

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {error && !showForm && (
          <div className="error-message">
            {error}
          </div>
        )}

        <section className="contacts-section">
          <div className="contacts-toolbar">
            <div>
              <h2>All Contacts</h2>
              <p>
                {filteredContacts.length}{" "}
                {filteredContacts.length === 1 ? "contact" : "contacts"}
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search contacts..."
              className="search-input"
            />
          </div>

          {loading ? (
            <div className="loading-state">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">
              <h3>
                {search ? "No contacts found" : "No contacts yet"}
              </h3>

              <p>
                {search
                  ? "Try a different search."
                  : "Add your first contact to get started."}
              </p>

              {!search && (
                <button
                  type="button"
                  className="primary-button"
                  onClick={openAddForm}
                >
                  + Add Contact
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="contacts-table-wrapper">
                <table className="contacts-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Company</th>
                      <th>Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentContacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>
                          <div className="contact-name">
                            {contact.firstName} {contact.lastName}
                          </div>
                        </td>

                        <td>
                          {contact.email || "-"}
                        </td>

                        <td>
                          {contact.phone || "-"}
                        </td>

                        <td>
                          {contact.company || "-"}
                        </td>

                        <td>
                          {contact.address || "-"}
                        </td>

                        <td>
                          <div className="contact-actions">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => openEditForm(contact)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handleDelete(contact.id)}
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

              <div className="pagination">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </section>

      {showForm && (
        <div className="modal-overlay">
          <div className="contact-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Edit Contact" : "Add Contact"}
                </h2>

                <p>
                  {editingId
                    ? "Update the contact details below."
                    : "Enter the contact details below."}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeForm}
                disabled={saving}
              >
                ×
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
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
    </main>
  );
}