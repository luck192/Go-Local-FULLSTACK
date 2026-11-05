import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ShopLogin.css";

const API_BASE = "https://go-local-fullstack.onrender.com/shop1"; // apne backend ka URL yahan badal lena
const ROLE = "shop";

function ShopLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false); // false = signin, true = signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shopName, setshopName] = useState("");
  const [category, setcategory] = useState("");
  const [shopAddress, setshopAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setIsSignup((s) => !s);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isSignup ? `${API_BASE}/signup` : `${API_BASE}/signin`;
      const body = isSignup
        ? { name, phone, password,shopName,category,shopAddress }
        : { phone, password};

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setError(isSignup ? "User already exists" : "Invalid credentials");
        return;
      }

      const data = await res.json().catch(() => ({}));
      localStorage.setItem("golocal_auth", JSON.stringify({ ...data, role: ROLE }));
      navigate(`/${ROLE}/home`);
    } catch {
      setError("Server se connect nahi ho paya. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="sl">
      <Link to="/" className="sl-back">← Back</Link>

      <section className="sl-shop">
        <div className="sl-awning" aria-hidden="true" />

        <div className="sl-sign">
          <span>Shop Owner</span>
        </div>

        <div className="sl-body">
          <h1 className="sl-heading">{isSignup ? "Apni dukaan jodo" : "Dukaan khol do"}</h1>
          <p className="sl-tagline">Apni dukaan ko online laao aur orders sambhalo.</p>

          <form className="sl-form" onSubmit={handleSubmit}>

            {isSignup && (
              <label className="sl-field">
                <span>Owner name</span>
                <input
                  type="text"
                  placeholder="Apna naam likho"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            )}
            {isSignup && (
              <label className="sl-field">
                <span>Shop Name</span>
                <input
                  type="text"
                  placeholder="Shop Name likho"
                  value={shopName}
                  onChange={(e) => setshopName(e.target.value)}
                  required
                />
              </label>
            )}
             {isSignup && (
              <label className="sl-field">
                <span>shop Address</span>
                <input
                  type="text"
                  placeholder="shop Address likho"
                  value={shopAddress}
                  onChange={(e) => setshopAddress(e.target.value)}
                  required
                />
              </label>
            )}
            {isSignup && (
              <label className="sl-field">
                <span> Category </span>
                <input
                  type="text"
                  placeholder=" Category likho"
                  value={category}
                  onChange={(e) => setcategory(e.target.value)}
                  required
                />
              </label>
            )}

            <label className="sl-field">
              <span>Phone number</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                minLength={10}
                placeholder="10 digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                required
              />
            </label>

            <label className="sl-field">
              <span>Password</span>
              <div className="sl-pass">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Apna password daalo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="sl-toggle" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p className="sl-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="sl-submit" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          <p className="sl-switch">
            {isSignup ? "Pehle se account hai?" : "Naye ho?"}{" "}
            <button type="button" onClick={switchMode}>
              {isSignup ? "Login karo" : "Account banao"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default ShopLogin;
