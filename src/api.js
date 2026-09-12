const API_URL = "https://alfaaz-backend-hhts.onrender.com/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("alfaaz_token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    localStorage.removeItem("alfaaz_token");
    window.location.href = "/";
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default apiRequest;