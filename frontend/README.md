# Student Management Platform — React Frontend

It is a very Basic Student Management System to understand practical working and structure of the DevOps tools such as GitHub, Ansible, Docker, and Jenkis.

Modern React + Vite frontend for the Spring Boot Student Management API.

Expected endpoints:

- GET /api/students
- POST /api/students
- PUT /api/students/{id}
- DELETE /api/students/{id}
- GET /actuator/health

Expected student JSON:

```json
{
  "id": 1,
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "course": "Computer Science"
}
```

If your existing Java Student entity uses different field names, change the mappings in `src/App.jsx`.

Local:

```powershell
npm install
copy .env.example .env
npm run dev
```

Use `VITE_API_BASE_URL=http://localhost:8082` locally.

For Vercel production, set:

`VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com`
