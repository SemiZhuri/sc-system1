import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    return (
        <div>
            {/* This div is for the trapezoid background image on the right */}
            <div className="mainbgi"></div>

            {/* This div is the container for your text content on the left */}
            <div style={{
                height: '92vh',
                width: '45%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingLeft: '5rem',
                paddingRight: '2rem',
               
            }}>
                <h1 style={{ fontSize: "3.5rem", fontWeight: 'bold' }}>
                    Student Management System
                </h1>
                <p style={{ fontSize: "1.2rem", margin: '2rem 0' }}>
                    A digital classroom — alive with roles, lessons, and learning.
Here, students step forward to enroll, teachers open the gates of knowledge, and admins quietly hold the structure together.
Each interaction weaves data into motion: a reflection of how education flows in real life — guided, organized, human.

Built on the spine of modern tools — React for clarity, FastAPI for speed, and PostgreSQL for depth — it stands as a bridge between learning and technology.
                </p>
                <Link to="/coursespage">
                    <Button variant="outline-dark" size="lg">See Our Courses</Button>
                </Link>
            </div>
        </div>
    );
}

export default HomePage;
