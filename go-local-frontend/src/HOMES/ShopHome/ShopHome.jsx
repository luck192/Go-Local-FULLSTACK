import { useNavigate } from "react-router-dom";
import "./ShopHome.css";

const CARDS = ["My items", "Incoming orders", "Shop profile"];

function getAuth() {
  try {
    return JSON.parse(localStorage.getItem("golocal_auth") || "null");
  } catch {
    return null;
  }
}

function ShopHome() {
  const navigate = useNavigate();
  const auth = getAuth();
  const userName = auth?.user?.name ?? auth?.name ?? "";

  const handleLogout = () => {
    localStorage.removeItem("golocal_auth");
    navigate("/");
  };

  return (
    <main className="sh">
      <header className="sh-top">
        <span className="sh-brand">GO Local · Shop Owner</span>
        <button type="button" className="sh-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="sh-content">
        <h1 className="sh-hello">Namaste{userName ? `, ${userName}` : ""} 👋</h1>
        <p className="sh-sub">Yahan tumhara dashboard banega. Abhi ye sab jald aa raha hai:</p>

        <div className="sh-grid">
          {CARDS.map((title) => (
            <div key={title} className="sh-card">
              <h2>{title}</h2>
              <span>will upload soon</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ShopHome;