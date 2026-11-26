
import API from "./api";

const getHeaders = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first.");
    }

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
};

// Get all skills of logged-in user
export const getMySkills = async () => {
    const response = await fetch(`${API}/api/skills`, {
        method: "GET",
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch skills");
    }

    return await response.json();
};

// Add a new skill
export const addSkill = async (skill) => {
    const response = await fetch(`${API}/api/skills`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            skillName: skill.skillName,
            category: skill.category,
            proficiency: skill.proficiency
        })
    });

    if (!response.ok) {
        throw new Error("Failed to add skill");
    }

    return await response.json();
};

// Update an existing skill
export const updateSkill = async (id, skill) => {
    const response = await fetch(`${API}/api/skills/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
            skillName: skill.skillName,
            category: skill.category,
            proficiency: skill.proficiency
        })
    });

    if (!response.ok) {
        throw new Error("Failed to update skill");
    }

    return await response.json();
};

// Delete a skill
export const deleteSkill = async (id) => {
    const response = await fetch(`${API}/api/skills/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to delete skill");
    }

    return await response.text();
};


// Get Skill Gap Analysis
export const getSkillGapAnalysis = async () => {
    const response = await fetch(`${API}/api/career-twin/skill-gap`, {
        method: "GET",
        headers: getHeaders()
    });

    if (!response.ok) {
        throw new Error("Failed to fetch skill gap analysis");
    }

    return await response.json();
};