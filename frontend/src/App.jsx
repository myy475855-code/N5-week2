import { useState } from "react";
import { api } from "./api";
import { useAsync } from "./useAsync";

const STATUSES = ["PENDING", "REVIEWED", "ACCEPTED", "REJECTED"];

function ErrorBox({ error, onRetry }) {
  return (
    <div className="error" role="alert">
      <p>{error.message}</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
}

function Internships() {
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [studentId, setStudentId] = useState("");
  const [notice, setNotice] = useState(null);

  const list = useAsync(() => api.internships({ location, skill }), [location, skill]);
  const students = useAsync(() => api.students(), []);
  const skills = useAsync(() => api.skills(), []);

  async function apply(internshipId) {
    if (!studentId) return setNotice({ type: "error", text: "Choose who is applying first." });
    try {
      await api.apply(Number(studentId), internshipId);
      setNotice({ type: "ok", text: "Application sent." });
    } catch (e) {
      setNotice({
        type: "error",
        text: e.status === 409 ? "This student has already applied to that internship." : e.message,
      });
    }
  }

  return (
    <section>
      <div className="filters">
        <label>Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Lahore" />
        </label>
        <label>Skill
          <select value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">Any skill</option>
            {(skills.data ?? []).map((s) => <option key={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>Applying as
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)}>
            <option value="">Choose a student</option>
            {(students.data ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
      </div>

      {notice && <p className={`notice ${notice.type}`} role="status">{notice.text}</p>}
      {list.loading && <p className="muted">Loading internships…</p>}
      {list.error && <ErrorBox error={list.error} onRetry={list.reload} />}
      {list.data?.length === 0 && <p className="muted">No internships match those filters. Clear a filter to see more.</p>}

      <ul className="cards">
        {(list.data ?? []).map((i) => (
          <li key={i.id}>
            <h3>{i.title}</h3>
            <p className="company">{i.company.name} · {i.location}{i.isRemote ? " · Remote OK" : ""}</p>
            <p>{i.description}</p>
            <p className="tags">{i.requiredSkills.map((s) => <span key={s}>{s}</span>)}</p>
            <button onClick={() => apply(i.id)}>Apply</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Applications() {
  const apps = useAsync(() => api.applications(), []);

  async function change(id, status) {
    try {
      await api.setStatus(id, status);
      apps.reload();
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <section>
      {apps.loading && <p className="muted">Loading applications…</p>}
      {apps.error && <ErrorBox error={apps.error} onRetry={apps.reload} />}
      {apps.data?.length === 0 && <p className="muted">No applications yet. Apply to an internship to see it here.</p>}
      <table>
        <tbody>
          {(apps.data ?? []).map((a) => (
            <tr key={a.id}>
              <td>{a.student.name}</td>
              <td>{a.internship.title}<br /><span className="muted">{a.internship.company.name}</span></td>
              <td>
                <select value={a.status} onChange={(e) => change(a.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("internships");
  return (
    <main>
      <header>
        <h1>TalentBridge</h1>
        <nav>
          <button aria-pressed={tab === "internships"} onClick={() => setTab("internships")}>Internships</button>
          <button aria-pressed={tab === "applications"} onClick={() => setTab("applications")}>Applications</button>
        </nav>
      </header>
      {tab === "internships" ? <Internships /> : <Applications />}
    </main>
  );
}
