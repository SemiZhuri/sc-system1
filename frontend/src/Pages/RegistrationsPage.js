import React,{useEffect, useState} from "react";
import { fetchRegistrations, fetchUsers, fetchCourses, deleteRegistrations } from "../api/api";
import { Button, OffcanvasTitle, Table } from "react-bootstrap";

const RegistrationsPage = () => {
    const [registrations, setRegistrations] = useState([]);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [filteredRegistrations, setFilteredRegistrations] = useState([]);
    


    useEffect(() => {
        fetchRegistrations().then(data => setRegistrations(data));
        fetchCourses().then(data => setCourses(data));
    }, []);

    useEffect(() => {
        fetchUsers().then(data => setUsers(data));
    }, []);

    useEffect(() => { 
        if (currentCourse) {
            const filtered = registrations.filter(r => r.course_id === currentCourse.id);
            setFilteredRegistrations(filtered);
        }
    }, [currentCourse, registrations]);


    const handleCourseClick = (course) => {
        setCurrentCourse(course);
    }

    const handleDeleteRegistration = (registration_id) => {
    deleteRegistrations(registration_id).then(() => {
        setRegistrations(currentRegistrations => 
            currentRegistrations.filter(reg => reg.id !== registration_id)
        );
    });
}


    return(
        <div style={{minHeight: "100vh"}}>
            <div className="d-flex justify-content-center align-items-center mb-4">
            <OffcanvasTitle>Courses</OffcanvasTitle>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-3">
        {courses.map(c => (
            <div key={c.id} >
                <Button variant="outline-dark" active = {currentCourse && currentCourse.id === c.id} onClick={() => handleCourseClick(c)}>{c.title}</Button>
           </div>
            ))}
         </div>
        {currentCourse && (
            
            <div style={{width:"100%", minHeight: "100%", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0"}}>
                    <OffcanvasTitle>List of Registrations for {currentCourse.title}</OffcanvasTitle>
                    <div style={{width: "28vw"}}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{width: "60px"}}>#</th>
                                <th>User</th>
                                <th style={{width: "90px"}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                     <td>{users.find(u => u.id === r.user_id)?.name}</td>
                                    <td><Button variant="danger" onClick={() => handleDeleteRegistration(r.id)}>Delete</Button></td>
                                </tr>
                            ))}
                                    
                        </tbody>

                    </Table>
                </div>
            </div>
         
        )}
        {!currentCourse &&(
            <div style={{display:"flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "10px", margin: "20px 0"}}>
                <OffcanvasTitle>No course selected, pls select a course to reveal the registrations.</OffcanvasTitle>
                </div>
        )}
       </div>
    )
    
}

export default RegistrationsPage;