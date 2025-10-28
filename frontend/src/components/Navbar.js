import React, { useEffect , useState}from 'react';
import './Navbar.css';
import { getUserProfile } from '../api/api';
import { NavLink } from 'react-router-dom';

const Navbar = ({ token, onLogout }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (token) {
                try {
                    const userData = await getUserProfile(token);
                    setUser(userData);
                    setRole(userData.role);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                   
                    setUser(null);
                    setRole(null);
                }
            } else { 
                setUser(null);
                setRole(null);
            }
        };

        fetchUserProfile();
    }, [token]); 


  return (
    
    <nav>
      <ul>
        <li>
          <NavLink to="/homepage" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Home</NavLink>
        </li>
        {!token && (
        <li>
          <NavLink to="/signup" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Sign Up</NavLink>
        </li>
        )}
        {!token && (
        <li>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Log In</NavLink>
        </li>
        )}
        <li>
          <NavLink to="/coursespage" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Courses</NavLink>
        </li>
        {token && role === 'student' && (
        <li>
          <NavLink to="/mycoursespage" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>My Courses</NavLink>
        </li>
        )}
        {token && role !== 'student' && (
        <li>
          <NavLink to="/registrationspage" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Registrations</NavLink>
        </li>
        )}
        {token && role === 'admin' && (
          <li>
            <NavLink to="adminpage" className={({ isActive }) => isActive ? 'linki active' : 'linki'}>Admin Page</NavLink>
          </li>
        )}
        {token && (
          <li className='linki'>
           {user ? `${user.name}` : 'Profile'}
          </li>
        )}
        {token && (
          <li>
            <button onClick={onLogout} className='logOutBtn'>Log Out</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
