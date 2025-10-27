import React, { useEffect , useState}from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { getUserProfile } from '../api/api';

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
          <Link to="/homepage" className='linki'>Home</Link>
        </li>
        {!token && (
        <li>
          <Link to="/signup" className='linki'>Sign Up</Link>
        </li>
        )}
        {!token && (
        <li>
          <Link to="/login" className='linki'>Log In</Link>
        </li>
        )}
        <li>
          <Link to="/coursespage" className='linki'>Courses</Link>
        </li>
        {token && role === 'student' && (
        <li>
          <Link to="/mycoursespage" className='linki'>My Courses</Link>
        </li>
        )}
        {token && role !== 'student' && (
        <li>
          <Link to="/registrationspage" className='linki'>Registrations</Link>
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
