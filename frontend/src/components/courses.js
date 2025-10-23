import React, { useEffect, useState } from "react";  
import { fetchCourses, createCourse } from "../api/api";

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({ title: "", description: "" });


    useEffect(() => {
        fetchCourses().then(data => setCourses(data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCourse = await createCourse(form);
        setCourses([...courses, newCourse]);
        setForm({ title: "", description: "" });
    };

    return (
        <div>
            <h2>Courses</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Title" 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                />
                <input 
                    placeholder="Description" 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                />
                <button type="submit">Add Course</button>
            </form>     
            <ul>
                {courses.map(c => (
                    <li key={c.id}>{c.title} - {c.description}</li>
                ))}
            </ul>
        </div>
    );
    }

