import React, { useEffect, useState } from "react";
import { fetchCourses, createCourse, deleteCourse, updateCourses } from "../api/api";
import { Button, Modal, Table, Form } from "react-bootstrap";
import "./Courses.css";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCourses().then((data) => setCourses(data));
  }, []);

  const handleShowModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setForm({ title: course.title, description: course.description });
    } else {
      setEditingCourse(null);
      setForm({ title: "", description: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      const updatedCourse = await updateCourses(editingCourse.id, form);
      setCourses(courses.map((c) => (c.id === editingCourse.id ? updatedCourse : c)));
    } else {
      const newCourse = await createCourse(form);
      setCourses([...courses, newCourse]);
    }
    handleCloseModal();
  };

  const handleDelete = async (courseId) => {
    await deleteCourse(courseId);
    setCourses(courses.filter((c) => c.id !== courseId));
  };

  return (
    <div className="courses-page">
      <div className="courses-header">
        <h2>Courses Management</h2>
        <Button variant="dark" onClick={() => handleShowModal()}>+ Add Course</Button>
      </div>

      <div className="table-wrapper">
        <Table striped bordered hover responsive className="courses-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((c, index) => (
                <tr key={c.id}>
                  <td>{index + 1}</td>
                  <td>{c.title}</td>
                  <td>{c.description}</td>
                  <td>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(c)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-courses">
                  No courses available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCourse ? "Edit Course" : "Add Course"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="course-form">
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter course description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                {editingCourse ? "Update Course" : "Add Course"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
