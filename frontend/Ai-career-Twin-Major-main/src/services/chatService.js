const API_URL = "http://localhost:8081/api/chat";

const sendMessage = async (message) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first. JWT token not found.");
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed: ${response.status}`);
    }

    const data = await response.json();

    return data.reply;
};

export default sendMessage;