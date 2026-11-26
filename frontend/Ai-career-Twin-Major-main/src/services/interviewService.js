
import API from "./api";

const generateQuestions = async (role) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API}/api/interview/generate?role=${encodeURIComponent(role)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate questions: ${response.status}`);
  }

  return await response.json();
};

const evaluateAnswers = async (role, answers) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/interview/evaluate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role, answers }),
  });

  if (!response.ok) {
    throw new Error(`Failed to evaluate answers: ${response.status}`);
  }

  return await response.json();
};

const interviewService = {
  generateQuestions,
  evaluateAnswers,
};

export default interviewService;
