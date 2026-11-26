
import API from "./api";

const getJobRecommendations = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/api/jobs/recommendations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.status}`);
  }

  return await response.json();
};

const jobService = {
  getJobRecommendations,
};

export default jobService;
