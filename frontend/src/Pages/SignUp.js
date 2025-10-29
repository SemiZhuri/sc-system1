import React, { useEffect, useState } from "react";
import { fetchUsers, createUser, getUserProfile } from "../api/api";
import "./SignUp.css";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "student", password: "" });
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUsers().then(data => setUsers(data));

    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile(token)
        .then(data => {
          setCurrentUser(data);
        })
        .catch(err => {
          console.error("Failed to fetch user profile", err);
        });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const userData = {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        password: form.password.trim()
      };
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
      setForm({ name: "", email: "", role: "student", password: "" });
      setError({});
      navigate("/login");
    } catch (err) {
      setError({ server: err.message });
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "-68px" }}>
      <form className="suform" onSubmit={handleSubmit}>
        <h2 className="suHeader2">Sign Up</h2>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        {error.email && <Alert variant="danger">{error.email}</Alert>}
        <label htmlFor="role">Role:</label>
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          {currentUser && currentUser.role === 'admin' && (
            <option value="admin">Admin</option>
          )}
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        {error.password && <Alert variant="danger">{error.password}</Alert>}
        {error.server && <Alert variant="danger">{error.server}</Alert>}
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default SignUp;
