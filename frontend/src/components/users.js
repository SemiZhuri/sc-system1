import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "../api/api";

export default function Users() {
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
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
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

      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} ({u.email}) - {u.role} - {u.password}</li>
        ))}
      </ul>
    </div>
  );
}
