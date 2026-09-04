import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "../api";

function Profile({ user }) {
  const [profile, setProfile] = useState(null);
  const [allergyIn, setAllergyIn] = useState("");
  const [condIn, setCondIn] = useState("");

  useEffect(() => {
    getProfile(user.uid).then(setProfile);
  }, [user.uid]);

  // debounce-free simple autosave: fires on blur instead of every keystroke to limit writes
  function field(key) {
    return {
      value: profile?.[key] || "",
      onChange: (e) => setProfile({ ...profile, [key]: e.target.value }),
      onBlur: () => saveProfile(user.uid, { [key]: profile[key] }),
    };
  }

  async function addAllergy() {
    if (!allergyIn.trim()) return;
    const updated = [...(profile.allergies || []), allergyIn.trim()];
    setProfile({ ...profile, allergies: updated });
    await saveProfile(user.uid, { allergies: updated });
    setAllergyIn("");
  }

  async function removeAllergy(i) {
    const updated = profile.allergies.filter((_, idx) => idx !== i);
    setProfile({ ...profile, allergies: updated });
    await saveProfile(user.uid, { allergies: updated });
  }

  async function addCondition() {
    if (!condIn.trim()) return;
    const updated = [...(profile.conditions || []), condIn.trim()];
    setProfile({ ...profile, conditions: updated });
    await saveProfile(user.uid, { conditions: updated });
    setCondIn("");
  }

  async function removeCondition(i) {
    const updated = profile.conditions.filter((_, idx) => idx !== i);
    setProfile({ ...profile, conditions: updated });
    await saveProfile(user.uid, { conditions: updated });
  }

  if (!profile) return null;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700 }}>My Profile</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "3px" }}>Your personal health information</p>
      </div>

      <div className="g2" style={{ alignItems: "start" }}>
        <div>
          <div className="profile-section">
            <div className="profile-section-title">Personal Information</div>
            <div className="f-group"><label>Full Name</label><input {...field("name")} placeholder="Your name" /></div>
            <div className="f-group"><label>Date of Birth</label><input type="date" {...field("dob")} /></div>
            <div className="f-group"><label>Gender</label>
              <select {...field("gender")}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="f-group"><label>Blood Type</label>
              <select {...field("blood")}>
                <option value="">Select</option>
                <option>A+</option><option>A−</option><option>B+</option><option>B−</option>
                <option>AB+</option><option>AB−</option><option>O+</option><option>O−</option>
              </select>
            </div>
            <div className="f-group"><label>Phone</label><input type="tel" {...field("phone")} placeholder="+91 98765 43210" /></div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Emergency Contact</div>
            <div className="f-group"><label>Name</label><input {...field("ecName")} placeholder="Parent / Spouse" /></div>
            <div className="f-group"><label>Relation</label><input {...field("ecRel")} placeholder="Father, Mother…" /></div>
            <div className="f-group"><label>Phone</label><input type="tel" {...field("ecPhone")} placeholder="+91 99887 76655" /></div>
          </div>
        </div>

        <div>
          <div className="profile-section">
            <div className="profile-section-title">Allergies</div>
            <div className="tags-wrap">
              {(profile.allergies || []).map((a, i) => (
                <span key={i} className="allergy-tag" style={{ cursor: "pointer" }} onClick={() => removeAllergy(i)}>{a} ✕</span>
              ))}
            </div>
            <div className="tag-input">
              <input value={allergyIn} onChange={(e) => setAllergyIn(e.target.value)} placeholder="e.g. Penicillin"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())} />
              <button className="btn btn-primary btn-sm" onClick={addAllergy}>Add</button>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Chronic Conditions</div>
            <div className="tags-wrap">
              {(profile.conditions || []).map((c, i) => (
                <span key={i} className="cond-tag" style={{ cursor: "pointer" }} onClick={() => removeCondition(i)}>{c} ✕</span>
              ))}
            </div>
            <div className="tag-input">
              <input value={condIn} onChange={(e) => setCondIn(e.target.value)} placeholder="e.g. Diabetes Type 2"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())} />
              <button className="btn btn-primary btn-sm" onClick={addCondition}>Add</button>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-title">Body Metrics</div>
            <div className="f-group"><label>Height (cm)</label><input type="number" {...field("height")} placeholder="170" /></div>
            <div className="f-group"><label>Weight (kg)</label><input type="number" {...field("weight")} placeholder="65" /></div>
            <div className="f-group"><label>ABHA / Health ID</label><input {...field("abha")} placeholder="Ayushman Bharat ID" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
