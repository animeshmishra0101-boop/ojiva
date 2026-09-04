import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import History from "./pages/History";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return null; // or a spinner

  if (!user) {
    return <Login />; // onAuthStateChanged will flip `user` once login succeeds
  }

  return (
    <div className="page-app">
      <Navbar user={user} tab={tab} setTab={setTab} />
      <div className="app-content">
        {tab === "dashboard" && <Dashboard user={user} setTab={setTab} />}
        {tab === "medications" && <Medications user={user} />}
        {tab === "history" && <History user={user} />}
        {tab === "emergency" && <Emergency user={user} />}
        {tab === "profile" && <Profile user={user} />}
      </div>
    </div>
  );
}

export default App;
