const API_URL = "https://alfaaz-backend-hhts.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("alfaaz_token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await res.json();

  if (res.status === 401) {
    localStorage.removeItem("alfaaz_token");
    window.location.href = "/";
    return;
  }

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
};

export default apiRequest;