import { useState } from "react";
import { signup, login, loginWithGoogle } from "../api";

function Login() {
  const [tab, setTab] = useState("login");
  const [err, setErr] = useState("");

  // login fields
  const [lEmail, setLEmail] = useState("");
  const [lPass, setLPass] = useState("");

  // signup fields
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPass, setSPass] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    try {
      await login(lEmail, lPass);
      // onAuthStateChanged in App.jsx picks this up automatically
    } catch (e) {
      setErr(e.message.replace("Firebase: ", ""));
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setErr("");
    if (sPass.length < 8) {
      setErr("Password must be at least 8 characters");
      return;
    }
    try {
      await signup(sName, sEmail, sPass);
    } catch (e) {
      setErr(e.message.replace("Firebase: ", ""));
    }
  }

  async function handleGoogle() {
    setErr("");
    try {
      await loginWithGoogle();
    } catch (e) {
      setErr(e.message.replace("Firebase: ", ""));
    }
  }

  return (
    <div className="page-login">
      <div className="login-left">
        <div className="login-logo">Oji<span>va</span></div>
        <div className="login-tagline">"Your medical history, always there when it matters."</div>
        <ul className="login-feat">
          <li>Secure end-to-end encrypted records</li>
          <li>Emergency QR access for first responders</li>
          <li>Prescription reminders and tracking</li>
          <li>Instant doctor handoff summaries</li>
        </ul>
      </div>

      <div className="login-right">
        <div className="login-tabs">
          <button
            className={"login-tab" + (tab === "login" ? " active" : "")}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={"login-tab" + (tab === "signup" ? " active" : "")}
            onClick={() => setTab("signup")}
          >
            Sign up
          </button>
        </div>

        {err && (
          <div style={{
            background: "#FEE2E2", color: "#9B1C1C", padding: "9px 12px",
            borderRadius: "8px", fontSize: "0.82rem", marginBottom: "1rem"
          }}>
            {err}
          </div>
        )}

        {tab === "login" ? (
          <div>
            <div className="form-head">Welcome back</div>
            <div className="form-sub">Login to access your health records</div>
            <form onSubmit={handleLogin}>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" value={lEmail}
                  onChange={(e) => setLEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={lPass}
                  onChange={(e) => setLPass(e.target.value)} required />
              </div>
              <span className="forgot">Forgot password?</span>
              <button className="btn-grad" type="submit">Login →</button>
            </form>
            <div className="or-div">or</div>
            <button className="btn-outline" onClick={handleGoogle}>
              Continue with Google
            </button>
          </div>
        ) : (
          <div>
            <div className="form-head">Create account</div>
            <div className="form-sub">Set up your free Ojiva profile</div>
            <form onSubmit={handleSignup}>
              <div className="field">
                <label>Full name</label>
                <input type="text" placeholder="Your name" value={sName}
                  onChange={(e) => setSName(e.target.value)} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" value={sEmail}
                  onChange={(e) => setSEmail(e.target.value)} required />
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" placeholder="Min 8 characters" value={sPass}
                  onChange={(e) => setSPass(e.target.value)} required />
              </div>
              <button className="btn-grad" type="submit">Create account →</button>
            </form>
            <div className="or-div">or</div>
            <button className="btn-outline" onClick={handleGoogle}>
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
