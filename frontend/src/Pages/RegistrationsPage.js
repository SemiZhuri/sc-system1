import React, { useEffect, useState } from "react";
import { fetchRegistrations, fetchUsers, fetchCourses, deleteRegistrations } from "../api/api";
import { Button, OffcanvasTitle, Table } from "react-bootstrap";
import "./RegistrationsPage.css";

const RegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations().then((data) => setRegistrations(data));
    fetchCourses().then((data) => setCourses(data));
  }, []);

  useEffect(() => {
    fetchUsers().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (currentCourse) {
      const filtered = registrations.filter((r) => r.course_id === currentCourse.id);
      setFilteredRegistrations(filtered);
    }
  }, [currentCourse, registrations]);

  const handleCourseClick = (course) => {
    setCurrentCourse(course);
  };

  const handleDeleteRegistration = (registration_id) => {
    deleteRegistrations(registration_id).then(() => {
      setRegistrations((current) => current.filter((reg) => reg.id !== registration_id));
    });
  };

  return (
    <div className="registrations-page">
      <div className="courses-header">
        <OffcanvasTitle>Courses</OffcanvasTitle>
      </div>

      <div className="courses-list">
        {courses.map((c) => (
          <Button
            key={c.id}
            variant={currentCourse && currentCourse.id === c.id ? "dark" : "outline-dark"}
            className={`course-btn ${currentCourse && currentCourse.id === c.id ? "active" : ""}`}
            onClick={() => handleCourseClick(c)}
          >
            {c.title}
          </Button>
        ))}
      </div>

      {currentCourse ? (
        <div className="registrations-section">
          <OffcanvasTitle className="registrations-title">
            List of Registrations for <span className="course-name">{currentCourse.title}</span>
          </OffcanvasTitle>
          <div className="table-wrapper">
            <Table striped bordered hover responsive className="registrations-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{users.find((u) => u.id === r.user_id)?.name}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          className="delete-btn"
                          onClick={() => handleDeleteRegistration(r.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-registrations">
                      No registrations found for this course.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="no-course-selected">
          <OffcanvasTitle>No course selected</OffcanvasTitle>
          <p>Please select a course to reveal the registrations.</p>
        </div>
      )}
    </div>
  );
};

export default RegistrationsPage;
