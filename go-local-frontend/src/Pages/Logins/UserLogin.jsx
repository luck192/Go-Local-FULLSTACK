import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserLogin.css";

const API_BASE = "http://localhost:3000/user1"; // apne backend ka URL yahan badal lena
const ROLE = "user";

function UserLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false); // false = signin, true = signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
        ? { name, phone, password }
        : { phone, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(res);
        if (!res.ok) {
        setError(isSignup ? "User already exists" : "Invalid credentials");
        return;
      }

      const data = await res.json().catch(() => ({}));
      console.log("user data", data);
      localStorage.setItem("golocal_auth", JSON.stringify({ ...data, role: ROLE }));
      navigate(`/${ROLE}/home`);
    } catch {
      setError("Server se connect nahi ho paya. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="ul">
      <Link to="/" className="ul-back">← Back</Link>

      <section className="ul-card">
        <div className="ul-band">User {isSignup ? "Signup" : "Login"}</div>

        <div className="ul-body">
          <h1 className="ul-heading">{isSignup ? "Account banao" : "Welcome back"}</h1>
          <p className="ul-tagline">Apne local market ke kaam ghar baithe karwao.</p>

          <form className="ul-form" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="ul-field">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Apna naam likho"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            )}

            <label className="ul-field">
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

            <label className="ul-field">
              <span>Password</span>
              <div className="ul-pass">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Apna password daalo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="ul-toggle" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p className="ul-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="ul-submit" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          <p className="ul-switch">
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

export default UserLogin;