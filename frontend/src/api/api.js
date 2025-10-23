const BASE_URL = "http://127.0.0.1:8000";

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
  return res.json();
};

export const fetchCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses/`);
  return res.json();
};

export const createCourse = async (course) => {
  const res = await fetch(`${BASE_URL}/courses/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  return res.json();
};

export const fetchRegistrations = async () => {
  const res = await fetch(`${BASE_URL}/registrations/`);
  return res.json();
};

export const createRegistration = async (reg) => {
  const res = await fetch(`${BASE_URL}/registrations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reg),
  });
  return res.json();
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
  const res = await fetch(`${BASE_URL}/courses/${course_id}`, {
    method: "DELETE",
  });
  return res.json();
}

export const deleteRegistrations = async (registrations_id) => {
  const res = await fetch(`${BASE_URL}/registrations/${registrations_id}`, {
    method: "DELETE",
  });
  return res.json()
}