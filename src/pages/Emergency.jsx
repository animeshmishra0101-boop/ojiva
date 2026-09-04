import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getProfile, watchMedications } from "../api";

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Emergency({ user }) {
  const [profile, setProfile] = useState(null);
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    getProfile(user.uid).then(setProfile);
    const unsub = watchMedications(user.uid, setMeds);
    return unsub;
  }, [user.uid]);

  if (!profile) return null;

  const payload = [
    "OJIVA EMERGENCY PROFILE",
    `Name: ${profile.name || "Unknown"}`,
    `Blood type: ${profile.blood || "Unknown"}`,
    `DOB: ${profile.dob || "Unknown"}`,
    `Allergies: ${(profile.allergies || []).join(", ") || "None recorded"}`,
    `Conditions: ${(profile.conditions || []).join(", ") || "None recorded"}`,
    `Emergency contact: ${profile.ecName || "—"} (${profile.ecRel || "—"}) ${profile.ecPhone || ""}`,
  ].join("\n");

  function printCard() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>Ojiva Emergency Card</title>
    <style>body{font-family:Arial,sans-serif;max-width:380px;margin:20px auto;padding:20px}
    .border{border:3px solid #EF4444;padding:15px;border-radius:10px}
    h1{font-size:16px;color:#EF4444;margin:0 0 12px} .label{font-size:9px;text-transform:uppercase;color:#888;font-weight:700}
    .val{font-size:15px;font-weight:700;margin-bottom:10px} .tag{background:#FEE2E2;color:#9B1C1C;padding:2px 8px;border-radius:20px;font-size:11px;margin:2px;display:inline-block}
    </style></head><body><div class="border">
    <h1>EMERGENCY MEDICAL CARD — OJIVA</h1>
    <div class="label">Name</div><div class="val">${profile.name || "—"}</div>
    <div class="label">Blood Type</div><div class="val" style="font-size:24px;color:#EF4444">${profile.blood || "—"}</div>
    <div class="label">Date of Birth</div><div class="val">${fmtDate(profile.dob)}</div>
    <div class="label">Allergies</div><div class="val">${(profile.allergies || []).map(a => `<span class="tag">${a}</span>`).join("") || "None"}</div>
    <div class="label">Conditions</div><div class="val">${(profile.conditions || []).join(", ") || "None"}</div>
    <div class="label">Current Medications</div><div class="val">${meds.map(m => m.name + " " + m.dose).join(", ") || "None"}</div>
    <div class="label">Emergency Contact</div><div class="val">${profile.ecName || "—"} · ${profile.ecPhone || "—"}</div>
    </div>
    <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script></body></html>`);
    w.document.close();
  }

  return (
    <div>
      <div style={{ background: "var(--red)", color: "white", padding: "10px 1.25rem", borderRadius: "var(--r)", marginBottom: "1.25rem", textAlign: "center", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.04em" }}>
        EMERGENCY MEDICAL INFORMATION — FOR FIRST RESPONDERS
      </div>

      <div className="g2" style={{ alignItems: "start" }}>
        <div>
          <div className="em-card" style={{ marginBottom: "1rem" }}>
            <div className="em-hdr">
              <div>
                <div className="em-title">Critical Info</div>
                <div style={{ fontSize: "0.73rem", color: "var(--muted)" }}>Scan QR to access</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div><div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Patient</div><div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{profile.name || "—"}</div></div>
              <div><div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Blood Type</div><div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--red)" }}>{profile.blood || "—"}</div></div>
              <div><div style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>DOB</div><div style={{ fontWeight: 600 }}>{fmtDate(profile.dob)}</div></div>
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9B1C1C", textTransform: "uppercase", marginBottom: "5px" }}>Allergies</div>
              {(profile.allergies || []).length ? profile.allergies.map((a, i) => <span key={i} className="allergy-tag">{a}</span>) : <span style={{ color: "var(--muted)", fontSize: "0.83rem" }}>None on record</span>}
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#92400E", textTransform: "uppercase", marginBottom: "5px" }}>Conditions</div>
              {(profile.conditions || []).length ? profile.conditions.map((c, i) => <span key={i} className="cond-tag">{c}</span>) : <span style={{ color: "var(--muted)", fontSize: "0.83rem" }}>None on record</span>}
            </div>
          </div>

          <div className="card">
            <div className="card-label">Current Medications</div>
            {meds.length ? meds.map((m) => (
              <div className="rem-item" style={{ padding: "7px 0" }} key={m.id}>
                <div className="rem-time">{m.time}</div>
                <div><div className="rem-name">{m.name}</div><div className="rem-dose">{m.dose} — {m.freq}</div></div>
              </div>
            )) : <div className="empty" style={{ padding: "0.5rem 0" }}><p>No medications on record</p></div>}
          </div>
        </div>

        <div>
          <div className="card" style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div className="card-label" style={{ textAlign: "left" }}>Emergency QR Code</div>
            <div style={{ display: "flex", justifyContent: "center", margin: "1rem 0" }}>
              <QRCodeCanvas value={payload} size={172} level="M" />
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "1rem" }}>
              Print and keep on your ID card or wallet. First responders scan this in emergencies.
            </p>
            <button className="btn btn-primary btn-block" onClick={printCard}>Print Emergency Card</button>
          </div>

          <div className="card" style={{ borderLeft: "3px solid var(--purple)" }}>
            <div className="card-label">Emergency Contact</div>
            {profile.ecName ? (
              <div style={{ padding: "6px 0" }}>
                <div style={{ fontWeight: 600 }}>{profile.ecName}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{profile.ecRel}</div>
                <a href={`tel:${profile.ecPhone}`} style={{ color: "var(--purple)", fontWeight: 700, fontSize: "0.88rem", textDecoration: "none" }}>{profile.ecPhone}</a>
              </div>
            ) : <div className="empty" style={{ padding: "0.5rem 0" }}><p>Add in Profile</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emergency;
