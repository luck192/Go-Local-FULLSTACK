import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RiderHome.css";

const API = "https://go-local-fullstack.onrender.com/api/tasks"; // backend ka URL
const POLL_MS = 5000; // har 5 second me tasks refresh

const TABS = [
  { key: "available", label: "Available tasks" },
  { key: "active", label: "My active tasks" },
  { key: "earnings", label: "Earnings" },
];

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("golocal_rider") || "null");
  } catch {
    return null;
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function RiderHome() {
  const navigate = useNavigate();
  const auth = getAuth();

  // Agar tera login response ka shape alag hai to sirf yahan 2 lines badalni hain
  const riderId = auth?.user?._id ?? auth?._id ?? auth?.user?.id ?? auth?.id ?? "";
  const riderName = auth?.user?.name ?? auth?.name ?? "";
  const riderPhoneNo = auth?.user?.phone ?? auth?.phone??"";
 
  const [tab, setTab] = useState("available");
  const [available, setAvailable] = useState([]);
  const [mine, setMine] = useState([]); // rider ke accepted tasks (in progress + completed)
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }
  const [loadError, setLoadError] = useState("");

  const loadAll = useCallback(async () => {
    if (!riderId) return;
    try {
      const [aRes, mRes] = await Promise.all([
        fetch(`${API}/available`),
        fetch(`${API}/rider/${riderId}`),
      ]);
      // console.log("avaialbale task", await aRes.json());
      if (!aRes.ok || !mRes.ok) throw new Error("load failed");
      setAvailable(await aRes.json());
      setMine(await mRes.json());
      setLoadError("");
    } catch {
      setLoadError("Tasks load nahi ho paye. Backend chal raha hai?");
    }
  }, [riderId]);

  useEffect(() => {
    loadAll();
    const id = setInterval(loadAll, POLL_MS);
    return () => clearInterval(id);
  }, [loadAll]);

  const acceptTask = async (taskId) => {
    setBusyId(taskId);
    setMessage(null);
    try {
      const res = await fetch(`${API}/${taskId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId, riderName,riderPhoneNo }),
      });

      if (res.status === 409) {
        setMessage({ type: "error", text: "Ye task kisi aur rider ne le liya." });
      } else if (!res.ok) {
        throw new Error("accept failed");
      } else {
        setMessage({ type: "ok", text: "Task accept ho gaya. My active tasks me dekho." });
      }
      await loadAll();
    } catch {
      setMessage({ type: "error", text: "Task accept nahi ho paya. Dobara try karo." });
    } finally {
      setBusyId(null);
    }
  };

  const completeTask = async (taskId) => {
    setBusyId(taskId);
    setMessage(null);
    try {
      const res = await fetch(`${API}/${taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ riderId }),
      });
      if (!res.ok) throw new Error("complete failed");

      setMessage({ type: "ok", text: "Task complete! Earnings update ho gayi." });
      await loadAll();
    } catch {
      setMessage({ type: "error", text: "Task complete mark nahi ho paya. Dobara try karo." });
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("golocal_auth");
    navigate("/");
  };

  const inProgress = mine.filter((t) => t.status === "in_progress");
  const completed = mine.filter((t) => t.status === "completed");
  const totalEarnings = completed.reduce((sum, t) => sum + t.price, 0);

  return (
    <main className="rh">
      <header className="rh-top">
        <span className="rh-brand">GO Local · Rider</span>
        <button type="button" className="rh-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="rh-content">
        <h1 className="rh-hello">Namaste{riderName ? `, ${riderName}` : ""} 👋</h1>

        <nav className="rh-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`rh-tab ${tab === t.key ? "is-active" : ""}`}
              onClick={() => {
                setTab(t.key);
                setMessage(null);
              }}
            >
              {t.label}
              {t.key === "available" && available.length > 0 && <em>{available.length}</em>}
              {t.key === "active" && inProgress.length > 0 && <em>{inProgress.length}</em>}
              {t.key === "earnings" && totalEarnings > 0 && <em>₹{totalEarnings}</em>}
            </button>
          ))}
        </nav>

        {!riderId && (
          <p className="rh-error">Login ki details nahi mili. Ek baar logout karke dobara login karo.</p>
        )}
        {loadError && <p className="rh-error">{loadError}</p>}
        {message && (
          <p className={message.type === "ok" ? "rh-success" : "rh-error"} role="status">
            {message.text}
          </p>
        )}

        {/* ---------- AVAILABLE TASKS ---------- */}
        {tab === "available" && (
          <div className="rh-panel">
            {available.length === 0 ? (
              <p className="rh-empty">Abhi koi naya task nahi hai. Thodi der me dekho.</p>
            ) : (
              <div className="rh-list">
                {available.map((t) => (
                  <article key={t._id} className="rh-task">
                    <div className="rh-task-main">
                      <h3>{t.title}</h3>
                      {t.description && <p>{t.description}</p>}
                      {t.address && <p className="rh-meta">📍 {t.address}</p>}
                      <p className="rh-meta">
                        {t.createdByName ? `${t.createdByName} · ` : ""}
                        {formatDate(t.createdAt)}
                      </p>
                    </div>
                    <div className="rh-task-side">
                      <span className="rh-price">₹{t.price} milenge</span>
                      <button
                        type="button"
                        className="rh-accept"
                        disabled={busyId === t._id}
                        onClick={() => acceptTask(t._id)}
                      >
                        {busyId === t._id ? "..." : "Accept"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------- MY ACTIVE TASKS ---------- */}
        {tab === "active" && (
          <div className="rh-panel">
            <h2 className="rh-section-title rh-section-title--progress">
              In progress <em>{inProgress.length}</em>
            </h2>
            {inProgress.length === 0 ? (
              <p className="rh-empty">Koi task in progress nahi hai. Available tasks se koi accept karo.</p>
            ) : (
              <div className="rh-list">
                {inProgress.map((t) => (
                  <article key={t._id} className="rh-task">
                    <div className="rh-task-main">
                      <h3>{t.title}</h3>
                      {t.description && <p>{t.description}</p>}
                      {t.address && <p className="rh-meta">📍 {t.address}</p>}
                      <label className="rh-check">
                        <input
                          type="checkbox"
                          checked={false}
                          disabled={busyId === t._id}
                          onChange={() => completeTask(t._id)}
                        />
                        <span>Mark as completed</span>
                      </label>
                    </div>
                    <div className="rh-task-side">
                      <span className="rh-price">₹{t.price}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <h2 className="rh-section-title rh-section-title--done">
              Completed <em>{completed.length}</em>
            </h2>
            {completed.length === 0 ? (
              <p className="rh-empty">Abhi tak koi task complete nahi hua.</p>
            ) : (
              <div className="rh-list">
                {completed.map((t) => (
                  <article key={t._id} className="rh-task rh-task--done">
                    <div className="rh-task-main">
                      <h3>{t.title}</h3>
                      <label className="rh-check">
                        <input type="checkbox" checked disabled readOnly />
                        <span>Completed {t.completedAt ? `· ${formatDate(t.completedAt)}` : ""}</span>
                      </label>
                    </div>
                    <div className="rh-task-side">
                      <span className="rh-price">₹{t.price}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---------- EARNINGS ---------- */}
        {tab === "earnings" && (
          <div className="rh-panel">
            <div className="rh-earn">
              <span className="rh-earn-label">Total earnings</span>
              <span className="rh-earn-amount">₹{totalEarnings}</span>
              <span className="rh-earn-count">
                {completed.length} task{completed.length === 1 ? "" : "s"} complete
              </span>
            </div>

            {completed.length > 0 && (
              <ul className="rh-earn-list">
                {completed.map((t) => (
                  <li key={t._id}>
                    <span>{t.title}</span>
                    <strong>+ ₹{t.price}</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default RiderHome;
