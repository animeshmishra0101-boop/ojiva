import { useEffect, useState } from "react";
import { watchMedications, addMedication, deleteMedication } from "../api";

function today() { return new Date().toISOString().split("T")[0]; }

function Medications({ user }) {
  const [meds, setMeds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", dose: "", freq: "Once daily", time: "08:00",
    doctor: "", start: today(), notes: "",
  });

  useEffect(() => {
    const unsub = watchMedications(user.uid, setMeds);
    return unsub;
  }, [user.uid]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addMedication(user.uid, form);
    setForm({ name: "", dose: "", freq: "Once daily", time: "08:00", doctor: "", start: today(), notes: "" });
    setModalOpen(false);
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Medications</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "3px" }}>Track prescriptions and reminders</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Add Medication</button>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div className="card-label">Active Prescriptions</div>
        {meds.length === 0 ? (
          <div className="empty"><p>No medications added yet</p></div>
        ) : (
          <>
            <div className="med-row med-row-hdr"><span>Medication</span><span>Dosage</span><span>Frequency</span><span></span></div>
            {meds.map((m) => (
              <div className="med-row" key={m.id}>
                <div>
                  <div className="med-name">{m.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                    {m.doctor ? `Dr. ${m.doctor.replace(/^dr\.?\s*/i, "")}` : ""}{m.start ? ` · Started ${m.start}` : ""}
                  </div>
                </div>
                <div className="med-dose">{m.dose || "—"}</div>
                <div><span className="badge badge-purple">{m.freq}</span></div>
                <button className="btn btn-danger btn-sm" onClick={() => deleteMedication(user.uid, m.id)}>Remove</button>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="card">
        <div className="card-label">Daily Schedule</div>
        {meds.length === 0 ? (
          <div className="empty"><p>Add medications to see schedule</p></div>
        ) : (
          [...meds].sort((a, b) => (a.time || "").localeCompare(b.time || "")).map((m) => (
            <div className="rem-item" key={m.id}>
              <div className="rem-time">{m.time || "08:00"}</div>
              <div style={{ flex: 1 }}>
                <div className="rem-name">{m.name}</div>
                <div className="rem-dose">{m.dose} — {m.freq}{m.notes ? ` · ${m.notes}` : ""}</div>
              </div>
              <label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-sl"></span></label>
            </div>
          ))
        )}
      </div>

      <div className={"modal-overlay" + (modalOpen ? " open" : "")} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="modal">
          <div className="modal-hdr">
            <div className="modal-title">Add Medication</div>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          </div>
          <form onSubmit={handleAdd}>
            <div className="f-group"><label>Medication Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Metformin" required />
            </div>
            <div className="f-group"><label>Dosage</label>
              <input value={form.dose} onChange={(e) => setForm({ ...form, dose: e.target.value })} placeholder="e.g. 500mg" />
            </div>
            <div className="g2">
              <div className="f-group"><label>Frequency</label>
                <select value={form.freq} onChange={(e) => setForm({ ...form, freq: e.target.value })}>
                  <option>Once daily</option><option>Twice daily</option><option>Three times daily</option><option>As needed</option><option>Weekly</option>
                </select>
              </div>
              <div className="f-group"><label>Time</label>
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="f-group"><label>Prescribed by</label>
              <input value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} placeholder="Dr. Sharma" />
            </div>
            <div className="f-group"><label>Start Date</label>
              <input type="date" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            </div>
            <div className="f-group"><label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Take with food…" />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Save Medication</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Medications;
