import React, {useEffect, useState} from "react";
import {fetchRegistrations, createRegistration} from "../api/api";
import {fetchUsers} from "../api/api";
import {fetchCourses} from "../api/api";

export default function Registrations() {
    const [registrations, setRegistrations] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({user_id: "", course_id: ""});
    useEffect(() => {
        fetchRegistrations().then(data => setRegistrations(data));
        fetchUsers().then(data => setUsers(data));
        fetchCourses().then(data => setCourses(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newRegistration = await createRegistration(form);
        setRegistrations([...registrations, newRegistration]);
        setForm({user_id: "", course_id: ""});
    };
    return (
        <div>
            <h2>Registrations</h2>
            {/* <form onSubmit={handleSubmit}>
                <select value={form.user_id} onChange={e => setForm({...form, user_id: e.target.value})}>
                    <option value="">Select User</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>2</option>
                    ))}
                </select>   
                <select value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})}>
                    <option value="">Select Course</option>
                    {courses.map(c => (
                        <option key={c.id} value={c.id}>2</option>
                    ))}
                </select>
                <button type="submit">Add Registration</button>
            </form> 
            <ul>
                {registrations.map(r => (
                    <li key={r.id}>{users.find(u => u.id === r.user_id)} - {courses.find(c => c.id === r.course_id)}</li>
                ))}
            </ul> */}
        </div>
    );
}
