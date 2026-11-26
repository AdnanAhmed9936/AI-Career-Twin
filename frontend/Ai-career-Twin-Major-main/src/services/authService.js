
import API from "./api";

export const registerUser = async (userData) => {
    const response = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.message || `Login failed: ${response.status}`);
    }

    if (!data.token) {
        throw new Error("Login successful, but token was not received");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({
        fullName: data.fullName,
        email: data.email
    }));

    return data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getToken = () => {
    return localStorage.getItem("token");
};
