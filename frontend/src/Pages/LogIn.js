import React, { useEffect, useState } from "react";
import { loginUser } from "../api/api";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";


const LogIn = ({onLogin}) => {
    const [form, setForm] = useState({email: "", password: ""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/coursespage");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try{
            const data = await loginUser(form.email, form.password);
            onLogin(data.access_token);
            navigate("/coursespage");
        }catch(err){
            setError(err.message);
            }
      
    };

    return (
        <div style={{minHeight: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "-68px",
        }}>
            <form className="loginform" onSubmit={handleSubmit}>
                <h2 className="loginHeader2">Log In</h2>
                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="submit">Log In</button>
              
                <div>
                    {error && <p className="error">{error}</p>}
                    
                </div>
            </form>
        </div>
    );
}

export default LogIn;