import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RiderLogin.css";

const API_BASE = "http://localhost:3000/rider1"; // apne backend ka URL yahan badal lena
const ROLE = "rider";

function RiderLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false); // false = signin, true = signup
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setvehicleType] = useState("");
  const [vehicleNumber, setvehicleNumber] = useState("");
  const [drivingLicense, setdrivingLicense] = useState("");
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
        ? { name, phone, password,vehicleType, vehicleNumber,drivingLicense}
        : { phone, password  };

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
      console.log("rider data" , data);
      localStorage.setItem("golocal_rider", JSON.stringify({ ...data, role: ROLE }));
      navigate(`/${ROLE}/home`);
    } catch {
      setError("Server se connect nahi ho paya. Backend chal raha hai?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rl">
      <aside className="rl-side">
        <Link to="/" className="rl-back">← Back</Link>

        <div className="rl-pitch">
          <h1 className="rl-title">Rider</h1>
          <ul className="rl-points">
            <li>Apne area ke tasks dekho</li>
            <li>Jo pasand aaye, accept karo</li>
            <li>Kaam karo aur kamao</li>
          </ul>
        </div>
      </aside>

      <section className="rl-panel">
        <div className="rl-box">
          <h2 className="rl-heading">{isSignup ? "Rider account banao" : "Rider Login"}</h2>
          <p className="rl-tagline">
            {isSignup ? "Chand second ka kaam, phir tasks shuru." : "Wapas aaye ho, chalo kaam pe lagte hain."}
          </p>

          <form className="rl-form" onSubmit={handleSubmit}>
            {/* NAME  */}
            {isSignup && (
              <label className="rl-field">
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
            {/* vehicle Type */}
              {isSignup && (
              <label className="rl-field">
                <span>Vehicle Type</span>
                <input
                  type="text"
                  placeholder="Vehicle Type likho"
                  value={vehicleType}
                  onChange={(e) => setvehicleType(e.target.value)}
                  required
                />
              </label>
            )}
            {/* v number */}
              {isSignup && (
              <label className="rl-field">
                <span>Vehicle Number</span>
                <input
                  type="text"
                  placeholder="Vehicle Number likho"
                  value={vehicleNumber}
                  onChange={(e) => setvehicleNumber(e.target.value)}
                  required
                />
              </label>
            )}
            {/* set DL */}
              {isSignup && (
              <label className="rl-field">
                <span> Enter driving License</span>
                <input
                  type="text"
                  placeholder=" Enter driving License"
                  value={drivingLicense}
                  onChange={(e) => setdrivingLicense(e.target.value)}
                  required
                />
              </label>
            )}

            <label className="rl-field">
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

            <label className="rl-field">
              <span>Password</span>
              <div className="rl-pass">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Apna password daalo"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="rl-toggle" onClick={() => setShowPassword((s) => !s)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {error && (
              <p className="rl-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="rl-submit" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          <p className="rl-switch">
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

export default RiderLogin;