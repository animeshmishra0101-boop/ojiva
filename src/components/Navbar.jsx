import { logout } from "../api";

const TABS = [
  { id: "dashboard", label: "Home" },
  { id: "medications", label: "Medications" },
  { id: "history", label: "History" },
  { id: "emergency", label: "Emergency" },
  { id: "profile", label: "Profile" },
];

function Navbar({ user, tab, setTab }) {
  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="app-nav">
      <div className="nav-logo">Oji<span>va</span></div>
      <div className="nav-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"nav-tab" + (tab === t.id ? " active" : "")}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-right">
        <div className="nav-avatar">{initials}</div>
        <button
          className="btn btn-sm"
          style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none" }}
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
