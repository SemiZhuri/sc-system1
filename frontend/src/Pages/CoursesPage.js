import React,{useEffect, useState} from "react";
import { fetchCourses, createCourse, fetchRegistrations, createRegistration, getUserProfile, deleteCourse } from "../api/api";
import "./CoursesPage.css";
import { Modal, Button, Form, Card, Container} from "react-bootstrap";



const CoursesPage = () => {
     const [courses, setCourses] = useState([]);
        const [form, setForm] = useState({ title: "", description: "" });
        const [addButton, setAddButton] = useState(false);
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [role, setRole] = useState(null);
        const [currentUser, setCurrentUser] = useState(null);
        const [registrations, setRegistrations] = useState([]);
    
    
        useEffect(() => {
            fetchCourses().then(data => setCourses(data));
            fetchRegistrations().then(data => setRegistrations(data));
        }, []);

        useEffect(() => {
            getUserProfile(localStorage.getItem("token")).then(user => setCurrentUser(user));
        }, []);


        useEffect(() => {
            getUserProfile(localStorage.getItem("token")).then(user => setRole(user.role));
        }, []);


        const handleAddButtonClick = () => {
            if (!addButton){
            setAddButton(true);}
            else{
                setAddButton(false);
            }
        };

        const handleDeleteCourse = async (course_id) => {
            await deleteCourse(course_id);
            setCourses(courses.filter(course => course.id !== course_id));
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            const newCourse = await createCourse(form);
            setCourses([...courses, newCourse]);
            setForm({ title: "", description: "" });
        };

        const handleCourseClick = (course) => {
            setSelectedCourse(course);
        }

        const handleCloseModal = () => {
            setSelectedCourse(null);
        }

        const handleEnroll = async () => {
            if (currentUser && selectedCourse) {
                
                const newRegistration = await createRegistration({ user_id: currentUser.id, course_id: selectedCourse.id });
                setRegistrations([...registrations, newRegistration]);
                console.log("Enrolled successfully with registration:", newRegistration);
           
            }
        }


    return (
        <div>
            <Container className="d-flex justify-content-center align-items-center mt-4 mr-4 gap-4">
            <h2>Courses</h2>
            <Button onClick={handleAddButtonClick}>Add Course</Button>
            
                <Modal show={addButton} onHide={handleAddButtonClick} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                <Form.Control
                    placeholder="Title" 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })} 
                />
                    </Form.Group>
                    <Form.Group className="mb-3">
                <Form.Control 
                    as="textarea"   
                    rows={7}
                    placeholder="Description" 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                />
                </Form.Group>
                <div className = "d-flex justify-content-end" >
                <Button variant="primary" type="submit">Add Course</Button>
                </div>
            </Form>
            </Modal.Body>
            </Modal>  
            </Container>   
            <Container className="mt-4 d-flex flex-wrap justify-content-start">
            {courses.map(course => (
                <Card key={course.id} bg = "light" text = "dark" border="secondary" 
                className="hover-card"
                style={{width: '18rem', margin: '10px', height: '26rem', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
                    <Card.Img variant="top" onClick={() => handleCourseClick(course)} src={`https://picsum.photos/seed/${course.id}/250/250?blur=3`} style={{height: '12rem'}}  />
                    <Card.Body onClick={() => handleCourseClick(course)}>
                
                    <Card.Title className="text-truncate">{course.title}</Card.Title>
                    <Card.Text className="truncate-description">{course.description}</Card.Text>
                
                </Card.Body>
                {(role === 'admin' || role === 'teacher') && (
                <Card.Footer>
                    <div className="d-flex justify-content-end">
                        <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>
                            Delete
                        </Button>
                        </div>
                </Card.Footer>
            )}
                </Card>
            ))}
            </Container>
            <Modal show={selectedCourse !== null} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCourse ? selectedCourse.title : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{selectedCourse ? selectedCourse.description : ''}</p>
                </Modal.Body>
                <Modal.Footer>
                    {currentUser !== null && role === 'student' && (
                        <Button variant="primary" onClick={handleEnroll}>
                            Enroll
                        </Button>
                    )}
                    {(role === 'admin' || role === 'teacher') && (
                        <Button variant="danger" onClick={() => handleDeleteCourse(selectedCourse.id)}>
                            Delete
                        </Button>
                    )}
                    <Button variant="danger" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
             {registrations.map(r => (
                <div key={r.id}>
                    {r.user_id} - {r.course_id}
                </div>
            ))}

        </div>
    )
  
}

export default CoursesPage;