import React, { useState } from "react";
import Users from "../components/users";
import Courses from "../components/courses";
import Registrations from "../components/registrations";
import { Card, Container, Button } from "react-bootstrap";
import "./AdminPage.css";

const AdminPage = () => {
	const [activeView, setActiveView] = useState('cards');

	const getViewTitle = () => {
		switch (activeView) {
			case 'users':
				return 'Users';
			case 'courses':
				return 'Courses';
			case 'registrations':
				return 'Registrations';
			default:
				return 'Dashboard';
		}
	};

	const renderActiveView = () => {
		switch (activeView) {
			case 'users':
				return <Users />;
			case 'courses':
				return <Courses />;
			case 'registrations':
				return <Registrations />;
			default:
				return (
					<div className="admin-grid">
						<Card className="admin-tile" onClick={() => setActiveView('users')}>
							<Card.Body>
								<Card.Title>Users</Card.Title>
								<Card.Text>Manage all users and their roles</Card.Text>
							</Card.Body>
						</Card>
						<Card className="admin-tile" onClick={() => setActiveView('courses')}>
							<Card.Body>
								<Card.Title>Courses</Card.Title>
								<Card.Text>Create, edit, and organize courses</Card.Text>
							</Card.Body>
						</Card>
						<Card className="admin-tile" onClick={() => setActiveView('registrations')}>
							<Card.Body>
								<Card.Title>Registrations</Card.Title>
								<Card.Text>Track and manage course registrations</Card.Text>
							</Card.Body>
						</Card>
					</div>
				);
		}
	};

	return (
		<Container className="admin-container">
			<div className="admin-header">
				<h1>Admin Dashboard</h1>
				<p className="admin-subtitle">Manage users, courses, and registrations</p>
			</div>

			{activeView !== 'cards' && (
				<div className="admin-toolbar">
					<Button variant="outline-secondary" onClick={() => setActiveView('cards')}>
						← Back to Dashboard
					</Button>
					<h2 className="admin-view-title">{getViewTitle()}</h2>
				</div>
			)}

			{renderActiveView()}
		</Container>
	);
};

export default AdminPage;
