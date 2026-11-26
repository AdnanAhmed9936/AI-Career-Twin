
import API from "./api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

// Generate roadmap

export const generateRoadmap = async (role) => {
    const response = await fetch(
        `${API}/api/roadmaps/generate?role=${encodeURIComponent(role)}`,
        {
            method: "POST",
            headers: getAuthHeaders()
        }
    );

    const text = await response.text();

    let data = {};

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        throw new Error("Server returned an invalid response.");
    }

    if (!response.ok) {
        throw new Error(data.message || "Failed to generate roadmap");
    }

    if (!text) {
        throw new Error("Server returned an empty response. Please check the backend.");
    }

    return data;
};


// Get latest roadmap

export const getLatestRoadmap = async () => {
    const response = await fetch(
        `${API}/api/roadmaps/latest`,
        {
            method: "GET",
            headers: getAuthHeaders()
        }
    );

    if (response.status === 404) {
        return null;
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch roadmap");
    }

    return data;
};

// Update roadmap task completion
export const updateRoadmapTaskStatus = async (roadmapId, taskId, completed) => {
    const response = await fetch(
        `${API}/api/roadmaps/${roadmapId}/tasks/${taskId}`,
        {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify({ completed })
        }
    );

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
    }

    return data;
};