import { useEffect, useMemo, useState } from "react";
import {
  createStudent,
  deleteStudent,
  getHealth,
  getStudents,
  updateStudent,
} from "./api";

const emptyForm = { name: "", email: "", course: "" };

function Icon({ name, size = 20 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
    trash: <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 15H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
  );
}

function healthLabel(value) {
  if (value === "online") return "Online";
  if (value === "degraded") return "Degraded";
  if (value === "checking") return "Checking";
  return "Offline";
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "ST";
  return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

function StatCard({ label, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon"><Icon name={icon} size={20} /></div>
      <div><span>{label}</span><strong>{value}</strong></div>
      <div className="stat-line" />
    </div>
  );
}

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [health, setHealth] = useState("checking");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState(null);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });
    clearTimeout(window.__studentNoticeTimer);
    window.__studentNoticeTimer = setTimeout(() => setNotice(null), 3500);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(Array.isArray(data) ? data : data.content || []);
      setHealth("online");
    } catch (error) {
      setHealth("offline");
      showNotice(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    try {
      const data = await getHealth();
      setHealth(data?.status === "UP" ? "online" : "degraded");
    } catch {
      setHealth("offline");
    }
  };

  useEffect(() => {
    loadStudents();
    checkHealth();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((s) =>
      [s.id, s.name, s.email, s.course]
        .filter(Boolean).join(" ").toLowerCase().includes(query)
    );
  }, [students, search]);

  const courses = useMemo(
    () => new Set(students.map((s) => s.course).filter(Boolean)).size,
    [students]
  );

  const openAdd = () => {
    setForm(emptyForm);
    setModal({ type: "add", title: "Add Student" });
  };

  const openEdit = (student) => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      course: student.course || "",
    });
    setModal({ type: "edit", title: "Edit Student", student });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.course.trim()) {
      showNotice("Please complete all fields.", "error");
      return;
    }

    setSaving(true);
    try {
      if (modal.type === "edit") {
        await updateStudent(modal.student.id, form);
        showNotice("Student updated successfully.");
      } else {
        await createStudent(form);
        showNotice("Student added successfully.");
      }
      setModal(null);
      await loadStudents();
    } catch (error) {
      showNotice(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete ${student.name || "this student"}? This action cannot be undone.`)) return;
    try {
      await deleteStudent(student.id);
      showNotice("Student deleted successfully.");
      await loadStudents();
    } catch (error) {
      showNotice(error.message, "error");
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="users" size={23} /></div>
          <div><strong>StudentHub</strong><span>Management Platform</span></div>
        </div>

        <nav className="side-nav">
          <div className="nav-label">Workspace</div>
          <button className="nav-item active"><Icon name="grid" /> Dashboard</button>
          <button className="nav-item"><Icon name="users" /> Students</button>
          <button className="nav-item"><Icon name="book" /> Courses</button>
        </nav>

        <div className="sidebar-bottom">
          <div className="deploy-card">
            <div className="deploy-icon"><Icon name="activity" size={18} /></div>
            <div><strong>System status</strong><span className={`status-text ${health}`}>{healthLabel(health)}</span></div>
          </div>
          <small>Spring Boot API · React UI</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">STUDENT ADMINISTRATION</p><h1>Dashboard</h1></div>
          <div className="topbar-actions">
            <span className="api-chip"><span className={`dot ${health}`} /> API {healthLabel(health)}</span>
            <button className="icon-button" onClick={() => { loadStudents(); checkHealth(); }} title="Refresh"><Icon name="refresh" /></button>
            <div className="avatar">SM</div>
          </div>
        </header>

        <section className="content">
          <div className="hero">
            <div>
              <span className="hero-kicker">OVERVIEW</span>
              <h2>Manage your students with confidence.</h2>
              <p>Track student records, keep information organized, and manage your academic directory from one place.</p>
            </div>
            <button className="primary-button" onClick={openAdd}><Icon name="plus" size={18} /> Add Student</button>
          </div>

          <div className="stats-grid">
            <StatCard label="Total Students" value={students.length} icon="users" />
            <StatCard label="Active Records" value={students.length} icon="activity" />
            <StatCard label="Courses" value={courses} icon="book" />
            <StatCard label="API Status" value={health === "online" ? "UP" : "—"} icon="check" />
          </div>

          <section className="panel">
            <div className="panel-header">
              <div><h3>Student Directory</h3><p>{filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} shown</p></div>
              <div className="toolbar">
                <div className="search-box">
                  <Icon name="search" size={18} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." />
                </div>
                <button className="secondary-button" onClick={loadStudents}><Icon name="refresh" size={17} /> Refresh</button>
              </div>
            </div>

            <div className="table-wrap">
              {loading ? (
                <div className="state-box"><div className="spinner" /><p>Loading student records...</p></div>
              ) : filteredStudents.length === 0 ? (
                <div className="state-box empty">
                  <div className="empty-icon"><Icon name="users" size={25} /></div>
                  <h4>{search ? "No matching students" : "No students yet"}</h4>
                  <p>{search ? "Try another search term." : "Add your first student to get started."}</p>
                  {!search && <button className="primary-button" onClick={openAdd}><Icon name="plus" size={17} /> Add Student</button>}
                </div>
              ) : (
                <table>
                  <thead><tr><th>ID</th><th>Student</th><th>Email</th><th>Course</th><th>Status</th><th className="actions-col">Actions</th></tr></thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td><span className="id-badge">#{student.id}</span></td>
                        <td><div className="student-cell"><div className="student-avatar">{initials(student.name)}</div><strong>{student.name || "Unnamed student"}</strong></div></td>
                        <td><div className="email-cell"><Icon name="mail" size={15} /> {student.email || "—"}</div></td>
                        <td><span className="course-pill">{student.course || "—"}</span></td>
                        <td><span className="active-pill"><span /> Active</span></td>
                        <td><div className="row-actions">
                          <button className="row-button edit" onClick={() => openEdit(student)} title="Edit"><Icon name="edit" size={16} /></button>
                          <button className="row-button delete" onClick={() => handleDelete(student)} title="Delete"><Icon name="trash" size={16} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <footer className="footer"><span>Student Management Platform</span><span>React · Spring Boot · Docker · Jenkins</span></footer>
        </section>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => !saving && setModal(null)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div><span className="modal-kicker">STUDENT RECORD</span><h3>{modal.title}</h3></div>
              <button className="icon-button" onClick={() => setModal(null)} disabled={saving}><Icon name="x" /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>Full Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" /></label>
              <label>Email Address<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="rahul@example.com" /></label>
              <label>Course<input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} placeholder="e.g. Computer Science" /></label>
              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setModal(null)} disabled={saving}>Cancel</button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? <><span className="button-spinner" /> Saving...</> : <><Icon name="check" size={17} /> Save Student</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notice && <div className={`toast ${notice.type}`}><Icon name={notice.type === "error" ? "x" : "check"} size={17} /> {notice.message}</div>}
    </div>
  );
}
