import { useEffect, useState } from "react";
import { watchHistory, addHistory, deleteHistory } from "../api";

function today() { return new Date().toISOString().split("T")[0]; }
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const TYPE_BADGE = {
  Consultation: "badge-purple", "Follow-up": "badge-blue", Emergency: "badge-red",
  Surgery: "badge-orange", "Lab Test": "badge-blue", Vaccination: "badge-green",
};

function History({ user }) {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    date: today(), hosp: "", doc: "", diag: "", treat: "", type: "Consultation", notes: "",
  });

  useEffect(() => {
    const unsub = watchHistory(user.uid, setRecords);
    return unsub;
  }, [user.uid]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.diag.trim()) return;
    await addHistory(user.uid, form);
    setForm({ date: today(), hosp: "", doc: "", diag: "", treat: "", type: "Consultation", notes: "" });
    setModalOpen(false);
  }

  const q = search.toLowerCase();
  const filtered = records.filter((h) =>
    [h.diag, h.hosp, h.doc, h.treat, h.type].join(" ").toLowerCase().includes(q)
  );

  return (
    <div>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>Medical History</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "3px" }}>Complete record of your health visits</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Add Record</button>
      </div>

      <div className="card">
        <div className="search-wrap">
          <input className="search-box" placeholder="Search diagnoses, doctors, hospitals…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="empty"><p>{q ? "No results found" : "No records yet"}</p></div>
        ) : (
          <div className="timeline">
            {filtered.map((h) => (
              <div className="tl-item" key={h.id}>
                <div className="tl-dot"></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div className="tl-date">{fmtDate(h.date)}</div>
                    <div className="tl-title">{h.diag} &nbsp;<span className={"badge " + (TYPE_BADGE[h.type] || "badge-purple")}>{h.type}</span></div>
                    {h.hosp && <div className="tl-desc">{h.hosp}{h.doc ? ` — ${h.doc}` : ""}</div>}
                    {h.treat && <div className="tl-desc" style={{ color: "var(--purple)" }}>{h.treat}</div>}
                    {h.notes && <div className="tl-desc" style={{ fontStyle: "italic" }}>{h.notes}</div>}
                  </div>
                  <button className="btn btn-danger btn-sm" style={{ marginLeft: "10px", flexShrink: 0 }} onClick={() => deleteHistory(user.uid, h.id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={"modal-overlay" + (modalOpen ? " open" : "")} onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
        <div className="modal">
          <div className="modal-hdr">
            <div className="modal-title">Log Medical Visit</div>
            <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          </div>
          <form onSubmit={handleAdd}>
            <div className="f-group"><label>Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="f-group"><label>Hospital / Clinic</label>
              <input value={form.hosp} onChange={(e) => setForm({ ...form, hosp: e.target.value })} placeholder="AIIMS Delhi…" />
            </div>
            <div className="f-group"><label>Doctor</label>
              <input value={form.doc} onChange={(e) => setForm({ ...form, doc: e.target.value })} placeholder="Dr. Gupta" />
            </div>
            <div className="f-group"><label>Diagnosis</label>
              <input value={form.diag} onChange={(e) => setForm({ ...form, diag: e.target.value })} placeholder="Asthma, Fever…" required />
            </div>
            <div className="f-group"><label>Treatment / Prescription</label>
              <textarea value={form.treat} onChange={(e) => setForm({ ...form, treat: e.target.value })} placeholder="Medicines prescribed…" />
            </div>
            <div className="f-group"><label>Visit Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Consultation</option><option>Follow-up</option><option>Emergency</option><option>Surgery</option><option>Lab Test</option><option>Vaccination</option>
              </select>
            </div>
            <div className="f-group"><label>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes…" />
            </div>
            <button className="btn btn-primary btn-block" type="submit">Save Record</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default History;
