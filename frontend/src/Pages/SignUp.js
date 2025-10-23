import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../api/api";
import "./SignUp.css";



const SignUp = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "student" , password: ""});

  useEffect(() => {
    fetchUsers().then(data => setUsers(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = await createUser(form);
    setUsers([...users, newUser]);
    setForm({ name: "", email: "", role: "student" , password: ""});
  };

  return (
    
      <div style={{minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "-68px",
        }}>
      
      <form className = "suform" onSubmit={handleSubmit}>
        <h2 className = "suHeader2">Sign Up</h2>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button type="submit">Add User</button>
      </form>
    </div>
    
  );
};
export default SignUp;