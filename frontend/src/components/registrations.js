import React, { useEffect, useState } from "react";
import {
  fetchRegistrations,
  createRegistration,
  deleteRegistrations,
  fetchUsers,
  fetchCourses
} from "../api/api";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "./registrations.css";

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ user_id: "", course_id: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [regs, usersData, coursesData] = await Promise.all([
        fetchRegistrations(),
        fetchUsers(),
        fetchCourses(),
      ]);
      setRegistrations(regs);
      setUsers(usersData);
      setCourses(coursesData);
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.user_id || !form.course_id) return;

    const newRegistration = await createRegistration(form);
    setRegistrations([...registrations, newRegistration]);
    setForm({ user_id: "", course_id: "" });
    setShowModal(false);
  };

  const handleDelete = async (registrationId) => {
    await deleteRegistrations(registrationId);
    setRegistrations(registrations.filter((r) => r.id !== registrationId));
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown User";
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  return (
    <div className="registrations-container">
      <div className="registrations-header">
        <h2>Registrations</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Add Registration
        </Button>
      </div>

      {/* Registrations Table */}
      <Table striped bordered hover className="registrations-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((r, index) => (
            <tr key={r.id}>
              <td>{index + 1}</td>
              <td>{getUserName(r.user_id)}</td>
              <td>{getCourseTitle(r.course_id)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(r.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Registration Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>User</Form.Label>
              <Form.Select
                value={form.user_id}
                onChange={(e) =>
                  setForm({ ...form, user_id: e.target.value })
                }
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Select
                value={form.course_id}
                onChange={(e) =>
                  setForm({ ...form, course_id: e.target.value })
                }
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="modal-buttons">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
