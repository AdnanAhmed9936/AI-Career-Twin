
import API from "./api";
import { getToken } from "./authService";

// Get user profile
export const getUserProfile = async () => {
    const response = await fetch(`${API}/api/users/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
    }

    return data;
};

// Update user profile
export const updateUserProfile = async (profileData) => {
    const response = await fetch(`${API}/api/users/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
    }

    return data;
};
