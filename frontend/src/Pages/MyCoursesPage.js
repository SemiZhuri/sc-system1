import React, {useState, useEffect, use} from "react";
import { fetchUserCourses, deleteRegistrations, getUserProfile, fetchRegistrations } from "../api/api";
import { Modal, Button, Form, Card, Container} from "react-bootstrap";
import "./MyCoursesPage.css";

const MyCoursesPage = () => {
    const [userCourses, setUserCourses] = useState([]);
    const [thisUser, setThisUser] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [role, setRole] = useState(null);
    const [registrations, setRegistrations] = useState([]);

   
    

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token){
            setUserCourses([]);
            return;
        }
        if (token) {
            getUserProfile(token).then(user => {
                fetchUserCourses(user.id).then(data => setUserCourses(data));
                setThisUser(user);
                setRole(user.role);
            });
        }
    }, []);

    useEffect(() => {
        fetchRegistrations().then(data => setRegistrations(data));
    }, []);


    const handleCloseModal = () => {
            setSelectedCourse(null);
        }

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
    }

    const handleDeroll = async (course_id, user_id) => {
        const theRegistration = registrations.find(r => r.course_id === course_id && r.user_id === user_id);
        await deleteRegistrations(theRegistration.id);
        setUserCourses(userCourses.filter(course => course.id !== course_id));
    }

     const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.5)`; // 0.5 is the transparency
        };
    

    return(
        <div className="main-div-mycourses">
            <Container className="mt-4 pb-4 d-flex flex-wrap justify-content-start courses-list-container">
                <Container className="d-flex justify-content-center align-items-center mt-4 mr-4 gap-4 w-100">
                    <h2>My Courses</h2>
                </Container>
                        {userCourses.map(course => (
                            
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
                                            backgroundColor: getRandomColor(),
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
                            
                            <Card.Footer>
                                <div className="d-flex justify-content-end">
                                    <Button variant="danger" onClick={() => handleDeroll(course.id, thisUser.id)}>
                                        Deroll
                                    </Button>
                                    </div>
                            </Card.Footer>
                        
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
                                    <Button variant="danger" onClick={() => handleDeroll(selectedCourse.id, thisUser.id)}>
                                        Delete
                                    </Button>
                                <Button variant="danger" onClick={handleCloseModal}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
        </div>
    )
}

export default MyCoursesPage;