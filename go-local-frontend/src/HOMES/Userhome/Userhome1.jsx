import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserHome.css";

const API = "http://localhost:3000/api/tasks"; // backend ka URL
const POLL_MS = 5000; // har 5 second me orders refresh

const TABS = [
  { key: "post", label: "Post a task" },
  { key: "shops", label: "Nearby shops" },
  { key: "orders", label: "My orders" },
];

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("golocal_auth") || "null");
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

function OrderCard({ task }) {
  return (
    <article className="uh-order">
      <div className="uh-order-main">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        {task.address && <p className="uh-meta">📍 {task.address}</p>}
        <p className="uh-meta">
          Posted: {formatDate(task.createdAt)}
          {task.acceptedByName ? ` · Rider: ${task.acceptedByName}` : ""}
          {task.riderPhoneNo? ` . Rider PhoneNo: ${task.riderPhoneNo}`:""}
        </p>
      </div>
      <span className="uh-price">₹{task.price}</span>
    </article>
  );
}

function OrderSection({ title, tone, tasks, emptyText }) {
  return (
    <div className="uh-section">
      <h2 className={`uh-section-title uh-section-title--${tone}`}>
        {title} <em>{tasks.length}</em>
      </h2>
      {tasks.length === 0 ? (
        <p className="uh-empty">{emptyText}</p>
      ) : (
        <div className="uh-orders">
          {tasks.map((t) => (
            <OrderCard key={t._id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserHome1() {
  const navigate = useNavigate();
  const auth = getAuth();
  // console.log("mera pura auth", auth);

  // Agar tera login response ka shape alag hai to sirf yahan 2 lines badalni hain
  const userId = auth?.user?._id || auth?._id || auth?.user?.id || auth?.id || "";
  const userName = auth?.user?.name || auth?.name || "";

   
  const [tab, setTab] = useState("post");
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", address: "" });
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }
  const [loadError, setLoadError] = useState("");

  const loadTasks = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API}/user/${userId}`);
      if (!res.ok) throw new Error("load failed");
      setTasks(await res.json());
      setLoadError("");
    } catch {
      setLoadError("Orders load nahi ho paye. Backend chal raha hai?");
    }
  }, [userId]);

  useEffect(() => {
    loadTasks();
    const id = setInterval(loadTasks, POLL_MS);
    return () => clearInterval(id);
  }, [loadTasks]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    setMessage(null);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId, userName }),
      });
      console.log("Res",res);
      if (!res.ok) throw new Error("post failed");
    
      setForm({ title: "", description: "", address: "" });
      setMessage({ type: "ok", text: "Task post ho gaya! Ab riders ko dikh raha hai." });
      loadTasks();
    } catch {
      setMessage({ type: "error", text: "Task post nahi ho paya. Dobara try karo." });
    } finally {
      setPosting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("golocal_auth");
    navigate("/");
  };

  const waiting = tasks.filter((t) => t.status === "open");
  const inProgress = tasks.filter((t) => t.status === "in_progress");

  const acceptedBythis = inProgress[0]?.acceptedByName;
  const riderPhoneNo = inProgress[0]?.riderPhoneNo;

  
  const fulfilled = tasks.filter((t) => t.status === "completed");

  return (
    <main className="uh">
      <header className="uh-top">
        <span className="uh-brand">GO Local · User</span>
        <button type="button" className="uh-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="uh-content">
        <h1 className="uh-hello">Namaste{userName ? `, ${userName}` : ""} 👋</h1>

        <nav className="uh-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`uh-tab ${tab === t.key ? "is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === "orders" && tasks.length > 0 && <em>{tasks.length}</em>}
            </button>
          ))}
        </nav>

        {!userId && (
          <p className="uh-error">Login ki details nahi mili. Ek baar logout karke dobara login karo.</p>
        )}

        {/* ---------- POST A TASK ---------- */}
        {tab === "post" && (
          <div className="uh-panel">
            <h2 className="uh-panel-title">Kaunsa kaam karwana hai?</h2>
            <p className="uh-sub">Task likho, nearby rider usse accept karke kar dega.</p>

            <form className="uh-form" onSubmit={handlePost}>
              <label className="uh-field">
                <span>Task ka title</span>
                <input
                  name="title"
                  type="text"
                  placeholder="Jaise: Kirana se doodh aur bread lana"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="uh-field">
                <span>Details (optional)</span>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Kitna saamaan, kaunsi dukaan, koi special baat..."
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <label className="uh-field">
                <span>Address / location (optional)</span>
                <input
                  name="address"
                  type="text"
                  placeholder="Kahan pahunchana hai"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              {message && (
                <p className={message.type === "ok" ? "uh-success" : "uh-error"} role="status">
                  {message.text}
                </p>
              )}

              <button type="submit" className="uh-submit" disabled={posting || !userId}>
                {posting ? "Posting..." : "Post task"}
              </button>
            </form>
          </div>
        )}

        {/* ---------- NEARBY SHOPS ---------- */}
        {tab === "shops" && (
          <div className="uh-panel">
            <h2 className="uh-panel-title">Nearby shops</h2>
            <p className="uh-sub">Apne area ki dukaanein yahan dikhengi.</p>
            <span className="uh-soon">will upload soon</span>
          </div>
        )}

        {/* ---------- MY ORDERS ---------- */}
        {tab === "orders" && (
          <div className="uh-panel uh-panel--wide">
            {loadError && <p className="uh-error">{loadError}</p>}

            <OrderSection
              title="Waiting for rider"
              tone="waiting"
              tasks={waiting}
              emptyText="Koi task abhi rider ka wait nahi kar raha."
            />
            <OrderSection
              title={`In progress,accepted by ${acceptedBythis}, phone no: ${riderPhoneNo}`}
              tone="progress"
              tasks={inProgress}
              emptyText="Abhi koi task in progress nahi hai."
            />
            <OrderSection
              title="Fulfilled"
              tone="done"
              tasks={fulfilled}
              emptyText="Abhi tak koi task complete nahi hua."
            />
          </div>
        )}
      </section>
    </main>
  );
}

export default UserHome1;