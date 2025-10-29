import React,{useEffect, useState, useMemo} from "react";
import { fetchCourses, createCourse, fetchRegistrations, createRegistration, getUserProfile, deleteCourse, updateCourses, fetchCourseById } from "../api/api";
import "./CoursesPage.css";
import { Modal, Button, Form, Card, Container} from "react-bootstrap";
import { Alert } from "react-bootstrap";



const CoursesPage = () => {
     const [courses, setCourses] = useState([]);
        const [form, setForm] = useState({ title: "", description: "" });
        const [addButton, setAddButton] = useState(false);
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [role, setRole] = useState(null);
        const [currentUser, setCurrentUser] = useState(null);
        const [registrations, setRegistrations] = useState([]);
        const [updateMode, setUpdateMode] = useState(null);
        const [editingCourseId, setEditingCourseId] = useState(null);
        const [error, setError] = useState(null);
    
    
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
            setAddButton(true);
        }
            else{
                setAddButton(false);
                setEditingCourseId(null); 
                setUpdateMode(false);
                setForm({ title: "", description: "" });
            }
        };

        const handleDeleteCourse = async (course_id) => {
            console.log("Deleting course with ID:", course_id, "with user token", localStorage.getItem("token"), "and role", role, "and current user", currentUser);
            await deleteCourse(course_id);
            setCourses(courses.filter(course => course.id !== course_id));
        }
    
        const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            title: form.title.trim(),
            description: form.description.trim()
        };
        const newCourse = await createCourse(courseData);
        setCourses([...courses, newCourse]);
        setForm({ title: "", description: "" });
        };

       const handleUpdate = async (course_id) => {
        try {
            const courseData = {
                title: form.title.trim(),
                description: form.description.trim()
            };
            const updatedCourse = await updateCourses(course_id, courseData);
            setCourses(
                courses.map(course => (course.id === course_id ? updatedCourse : course))
            );
            setForm({ title: "", description: "" });
            setUpdateMode(false);
            setEditingCourseId(null);
        } catch (error) {
            setError({ message: error.message });
        }
        };

        const updateButtonClick = (course) => {
              if (!addButton){
            setAddButton(true);}
            else{
                setAddButton(false);
            }
            setUpdateMode(true);
            setEditingCourseId(course);
            fetchCourseById(course).then(data => setForm({title: data.title, description: data.description}));
        }

        const handleCourseClick = (course) => {
            setSelectedCourse(course);
        }

        const handleCloseModal = () => {
            setSelectedCourse(null);
            setEditingCourseId(null); 
            setError(null);
        }

        const handleEnroll = async () => {
            try{
            if (currentUser && selectedCourse) {
                const isEnrolled = registrations.some(registration => registration.course_id === selectedCourse.id && registration.user_id === currentUser.id);
                if (isEnrolled) {
                    setError({ e: "You are already enrolled in this course" });
                    return;
                }
                const newRegistration = await createRegistration({ user_id: currentUser.id, course_id: selectedCourse.id });
                setRegistrations([...registrations, newRegistration]);
                console.log("Enrolled successfully with registration:", newRegistration);
            }}catch(error){
                console.error("Failed to enroll:", error);
            }
        }

        const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.5)`; // 0.5 is the transparency
        };

        const randomColor = useMemo(() => getRandomColor(), [courses]);

    return (
        <div className="main-div-courses">
            <Container className="mt-4 d-flex flex-wrap justify-content-start courses-list-container">
            <Container className="d-flex justify-content-center align-items-center mt-4 mr-4 gap-4">
            <h2>Courses</h2>
            <Button onClick={handleAddButtonClick}>Add Course</Button>
            
                <Modal show={addButton} onHide={handleAddButtonClick} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Course</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                <Form onSubmit={(e) => {
                    e.preventDefault(); // Prevent page reload
                    if (updateMode) {
                        handleUpdate(editingCourseId); // Use the ID you stored in state
                    } else {
                        handleSubmit(e);
                    }
                }}>
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
                <Button variant="primary" type="submit">{updateMode ? "Update" : "Add Course"}</Button>
                </div>
            </Form>
            </Modal.Body>
            </Modal>  
            </Container>   
            
            {courses.map(course => (
                
                <Card key={course.id} bg = "light" text = "dark" border="light"
                className="hover-card"
                style={{width: '25rem', margin: '10px', height: '26rem', cursor: 'pointer',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'}}>
                    <div style={{ position: 'relative', height: '12rem' }}>
                        <Card.Img
                            variant="top"
                            onClick={() => handleCourseClick(course)}
                            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${course.id}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px'
                            }}
                        />
                        <div
                            onClick={() => handleCourseClick(course)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: randomColor,
                                mixBlendMode: 'multiply',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px'
                            }}
                        ></div>
                    </div>
                    <Card.Body onClick={() => handleCourseClick(course)}>

                    <Card.Title className="text-truncate" style={{fontSize: "26px"}}>{course.title}</Card.Title>
                    <Card.Text className="truncate-description">{course.description}</Card.Text>

                </Card.Body>
                {(role === 'admin' || role === 'teacher') && (
                <Card.Footer>
                    <div className="d-flex justify-content-end gap-1">
                        <Button variant="primary" onClick={() => updateButtonClick(course.id)}>
                            Edit
                        </Button>
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
                    {error && <Alert variant="danger">{error.e}</Alert>}
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
        </div>
    )
  
}

export default CoursesPage;