import { useEffect, useState } from "react";
import { getProfile, watchMedications, watchHistory } from "../api";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function Dashboard({ user, setTab }) {
  const [profile, setProfile] = useState(null);
  const [meds, setMeds] = useState([]);
  const [hist, setHist] = useState([]);

  useEffect(() => {
    getProfile(user.uid).then(setProfile);
    const unsubMeds = watchMedications(user.uid, setMeds);
    const unsubHist = watchHistory(user.uid, setHist);
    return () => { unsubMeds(); unsubHist(); };
  }, [user.uid]);

  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.name ? profile.name.split(" ")[0] : "";

  const age = profile?.dob
    ? Math.floor((Date.now() - new Date(profile.dob)) / 31557600000)
    : null;

  const initials = profile?.name
    ? profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--dark)" }}>
          {greet}{firstName ? `, ${firstName}` : ""}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "3px" }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {profile?.name ? (
        <div className="hero" style={{ marginBottom: "1rem" }}>
          <div className="hero-avatar">{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="hero-name">{profile.name}</div>
            <div className="hero-meta">
              {age ? `${age} yrs` : ""}{profile.gender ? ` · ${profile.gender}` : ""}{profile.phone ? ` · ${profile.phone}` : ""}
            </div>
            <div className="hero-chips">
              {(profile.allergies || []).map((a, i) => (
                <span key={i} className="hero-chip" style={{ background: "rgba(239,68,68,0.25)" }}>{a}</span>
              ))}
              {(profile.conditions || []).map((c, i) => (
                <span key={i} className="hero-chip">{c}</span>
              ))}
            </div>
          </div>
          {profile.blood && <div className="hero-blood">{profile.blood}</div>}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: "1rem", borderLeft: "4px solid var(--purple)", background: "#EEF0FF", display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ fontWeight: 700, color: "var(--purple)" }}>Complete your profile</div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>Add name, blood type and allergies</div>
          </div>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setTab("profile")}>Set up →</button>
        </div>
      )}

      <div className="g4" style={{ marginBottom: "1rem" }}>
        <div className="stat">
          <div className="stat-label">Medications</div>
          <div className="stat-val">{meds.length}</div>
          <div className="stat-sub">active</div>
        </div>
        <div className="stat">
          <div className="stat-label">History</div>
          <div className="stat-val">{hist.length}</div>
          <div className="stat-sub">records</div>
        </div>
        <div className="stat">
          <div className="stat-label">Allergies</div>
          <div className="stat-val">{profile?.allergies?.length || 0}</div>
          <div className="stat-sub">on record</div>
        </div>
        <div className="stat">
          <div className="stat-label">Reminders</div>
          <div className="stat-val">{meds.length}</div>
          <div className="stat-sub">today</div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="sec-hdr">
            <div className="card-label" style={{ margin: 0 }}>Today's Doses</div>
            <button className="btn btn-sec btn-sm" onClick={() => setTab("medications")}>View all</button>
          </div>
          {meds.length ? meds.slice(0, 4).map((m) => (
            <div className="rem-item" key={m.id}>
              <div className="rem-time">{m.time || "08:00"}</div>
              <div><div className="rem-name">{m.name}</div><div className="rem-dose">{m.dose} — {m.freq}</div></div>
            </div>
          )) : <div className="empty"><p>No medications yet</p></div>}
        </div>

        <div className="card">
          <div className="sec-hdr">
            <div className="card-label" style={{ margin: 0 }}>Recent Records</div>
            <button className="btn btn-sec btn-sm" onClick={() => setTab("history")}>View all</button>
          </div>
          {hist.length ? (
            <div className="timeline">
              {hist.slice(0, 4).map((h) => (
                <div className="tl-item" key={h.id}>
                  <div className="tl-dot"></div>
                  <div className="tl-date">{fmtDate(h.date)} · {h.type}</div>
                  <div className="tl-title">{h.diag}</div>
                  <div className="tl-desc">{h.hosp}{h.doc ? ` — ${h.doc}` : ""}</div>
                </div>
              ))}
            </div>
          ) : <div className="empty"><p>No records yet</p></div>}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="card-label">Quick Actions</div>
        <div className="g3">
          <button className="btn btn-primary btn-block" style={{ padding: "13px" }} onClick={() => setTab("medications")}>Add Medication</button>
          <button className="btn btn-sec btn-block" style={{ padding: "13px" }} onClick={() => setTab("history")}>Log Visit</button>
          <button className="btn btn-sec btn-block" style={{ padding: "13px" }} onClick={() => setTab("emergency")}>Share with Doctor</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
