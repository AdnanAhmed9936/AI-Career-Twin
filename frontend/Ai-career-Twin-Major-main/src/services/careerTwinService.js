
import API from "./api";

export async function getAvailableRoles() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(`${API}/api/career-twin/roles`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Unable to load available roles.");
  }

  return await response.json();
}

export async function getCareerAnalysis(role) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API}/api/career-twin/analyze?role=${encodeURIComponent(role)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load career analysis.");
  }

  return await response.json();
}

export async function getCareerRecommendations(role) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first.");
  }

  const response = await fetch(
    `${API}/api/career-twin/recommendations?role=${encodeURIComponent(role)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load AI recommendations.");
  }

  return await response.json();
}
