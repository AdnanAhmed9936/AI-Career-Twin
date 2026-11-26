import API from "./api";

const getProjects = async () => {
    const response = await fetch(`${API}/api/projects`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }

    return response.json();
};

const addProject = async (project) => {
    const response = await fetch(`${API}/api/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(project)
    });

    if (!response.ok) {
        throw new Error("Failed to add project");
    }

    return response.json();
};

const updateProject = async (id, project) => {
    const response = await fetch(`${API}/api/projects/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(project)
    });

    if (!response.ok) {
        throw new Error("Failed to update project");
    }

    return response.json();
};

const deleteProject = async (id) => {
    const response = await fetch(`${API}/api/projects/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to delete project");
    }

    return response.text();
};

export { getProjects, addProject, updateProject, deleteProject };