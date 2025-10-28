import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/api";
import { Button, Modal, Table, Form } from "react-bootstrap";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "student", password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  const handleShowModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({ name: user.name, email: user.email, role: user.role, password: "" });
    } else {
      setEditingUser(null);
      setForm({ name: "", email: "", role: "student", password: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }
      const updatedUser = await updateUser(editingUser.id, payload);
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)));
    } else {
      const newUser = await createUser(form);
      setUsers([...users, newUser]);
    }
    handleCloseModal();
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    setUsers(users.filter((u) => u.id !== userId));
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <h2>Users Management</h2>
        <Button variant="dark" onClick={() => handleShowModal()}>+ Add User</Button>
      </div>

      <div className="table-wrapper">
        <Table striped bordered hover responsive className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, index) => (
                <tr key={u.id}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="text-capitalize">{u.role}</td>
                  <td>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(u)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal for Add/Edit User */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="user-form">
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder={
                  editingUser ? "Leave blank to keep current password" : "Enter password"
                }
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                {editingUser ? "Update User" : "Add User"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
