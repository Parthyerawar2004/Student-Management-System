const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8082";

const STUDENTS_URL = `${API_BASE_URL}/api/students`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const getStudents = () => request(STUDENTS_URL);

export const createStudent = (student) =>
  request(STUDENTS_URL, {
    method: "POST",
    body: JSON.stringify(student),
  });

export const updateStudent = (id, student) =>
  request(`${STUDENTS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });

export const deleteStudent = (id) =>
  request(`${STUDENTS_URL}/${id}`, {
    method: "DELETE",
  });

export const getHealth = () =>
  request(`${API_BASE_URL}/actuator/health`);

export { API_BASE_URL };
