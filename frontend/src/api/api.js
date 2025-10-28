const BASE_URL = "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("token");


export const fetchUsers = async () => {
  const res = await fetch(`${BASE_URL}/users/`);
  return res.json();
};

export const createUser = async (user) => {
  const res = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  const data = await res.json();

  if(!res.ok){
    throw new Error(data.detail || "Something went wrong");
  }else{
    return data;
  }
};

export const fetchCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses/`);
  return res.json();
};

export const createCourse = async (course) => {
  const token = getToken(); // ⬅️ Get the token
  if (!token) {
    throw new Error("User is not logged in."); // Optional check
  }

  const res = await fetch(`${BASE_URL}/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" ,
                "Authorization": `Bearer ${token}` 
    },

    body: JSON.stringify(course),
  });
  const data = await res.json();

  if(!res.ok){
    throw new Error(data.detail || "Something went wrong");
  }else{
    return data;
  }
};

export const fetchRegistrations = async () => {
  const res = await fetch(`${BASE_URL}/registrations/`);
  return res.json();
};

export const createRegistration = async (reg) => {
  const token = getToken(); // ⬅️ Get the token
  if (!token) {
    throw new Error("User is not logged in."); // Optional check
  }

   const res = await fetch(`${BASE_URL}/registrations/`, {
   method: "POST",
     headers: { 
        "Content-Type": "application/json",
        // 🚨 ADD THE AUTHORIZATION HEADER 🚨
        "Authorization": `Bearer ${token}` 
    }, 
   body: JSON.stringify(reg),
   });

  const data = await res.json();
  if(!res.ok){
   throw new Error(data.detail || "Something went wrong");
  }else{
  return data;
  }
};

export const loginUser = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    body: formData,
  });
  
  if (res.ok) {
    const data = await res.json();
    return data;
  }else{
    throw new Error("Login failed");
  }

}

export const getUserProfile = async (token) => {
  const res = await fetch(`${BASE_URL}/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.json();
};

export const fetchUserById = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}/`);
  return res.json();
}


export const logOutUser = () => {
  localStorage.removeItem("token");
}

export const deleteCourse = async (course_id) => {

  const token = getToken(); // ⬅️ Get the token
  
  if (!token) {
        throw new Error("Not authenticated. Please log in.");
    }

  const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
    method: "DELETE",
     headers: {
            "Content-Type": "courses/json",
            // 2. 🚨 THE CRITICAL FIX: Add the Authorization header 🚨
            "Authorization": `Bearer ${token}` 
        },
       
  });
   const data = await res.json();

   if(!res.ok){
    throw new Error(data.detail || "Something went wrong");
  }else{
    return data;
   }
}

export const deleteRegistrations = async (registrations_id) => {

  const token = getToken(); // ⬅️ Get the token
  

  const res = await fetch(`${BASE_URL}/registrations/${registrations_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "registrations/json",
      "Authorization": `Bearer ${token}`,
    },
    
  });
  const data =  await res.json();

  if(!res.ok){
    throw new Error(data.detail || "Something went wrong");
  }else{
    return data;
  }
}

export const updateUser = async (user_id, user) => {
    const token = getToken();
    if (!token) {
        throw new Error("Not authenticated. Please log in.");
    }

    const res = await fetch(`${BASE_URL}/users/${user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(user),
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Could not update user.");
    } else {
        return data;
    }
}

export const deleteUser = async (user_id) => {
    const token = getToken();
    if (!token) {
        throw new Error("Not authenticated. Please log in.");
    }

    const res = await fetch(`${BASE_URL}/users/${user_id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (res.status === 204) {
        return { message: "User deleted successfully" };
    }


    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Could not delete user.");
    } else {
        return data;
    }
}


export const fetchUserCourses = async (user_id) => {
    // 1. Get the token, as this is a protected endpoint
    const token = getToken(); 
    
    // Optional: Throw an error immediately if no token is found
    if (!token) {
        throw new Error("Not authenticated. Please log in.");
    }

    const res = await fetch(`${BASE_URL}/users/${user_id}/courses/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            // 2. 🚨 THE CRITICAL FIX: Add the Authorization header 🚨
            "Authorization": `Bearer ${token}` 
        },
    });

    const data = await res.json();

    if (!res.ok) {
        // Handle server-side errors (like 401, 403, 404)
        throw new Error(data.detail || "Could not fetch user courses.");
    } else {
        return data;
    }
}

export const updateCourses = async (course_id, cour) => {
  const token = getToken();

  if(!token){
    throw new Error("Not authenticated. Please log in.")
  }

  const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
    method: "PUT",
    headers: {
       "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
    }, body: JSON.stringify(cour),
  });

  const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Could not update course.");
    } else {
        return data;
    }

}

export const fetchCourseById = async (course_id) => {
  
   const token = getToken();

  if(!token){
    throw new Error("Not authenticated. Please log in.")
  }
const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
    method: "GET",
    headers: {
       "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
    },
  });
   const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Could not update course.");
    } else {
        return data;
    }

}