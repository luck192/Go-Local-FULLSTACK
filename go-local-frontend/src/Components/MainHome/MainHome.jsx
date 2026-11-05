import "./MainHome.css";

const ROLES = [
  {
    key: "user",
    label: "User",
    hint: "Get your local tasks done",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="16" r="8" />
        <path d="M8 42c0-9 7-15 16-15s16 6 16 15" />
      </svg>
    ),
  },
  {
    key: "rider",
    label: "Rider",
    hint: "Take tasks and earn",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="12" cy="34" r="7" />
        <circle cx="37" cy="34" r="7" />
        <path d="M12 34l9-14h11l5 14M21 20l-3-6h-5M28 20l4-6h4" />
      </svg>
    ),
  },
  {
    key: "shop",
    label: "Shop Owner",
    hint: "Bring your shop online",
    icon: (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 18l3-10h30l3 10c0 3-2.5 5-5.5 5S31 21 31 18c0 3-3 5-7 5s-7-2-7-5c0 3-2.5 5-5.5 5S6 21 6 18z" />
        <path d="M9 24v16h30V24M20 40V30h8v10" />
      </svg>
    ),
  },
];

function MainHome({ onSelect = (role) =>  navigate(`/${role}/login`) }) {
  return (
    <main className="mh">
      <header className="mh-head">
        <h1 className="mh-title">GO Local</h1>
        <p className="mh-sub">Local market ke kaam, ghar baithe.</p>
      </header>

      <section className="mh-roles" aria-label="Choose how you want to continue">
        {ROLES.map((role) => (
          <button
            key={role.key}
            type="button"
            className={`mh-circle mh-circle--${role.key}`}
            onClick={() => onSelect(role.key)}
          >
            <span className="mh-icon">{role.icon}</span>
            <span className="mh-label">{role.label}</span>
            <span className="mh-hint">{role.hint}</span>
          </button>
        ))}
      </section>
    </main>
  );
}

export default MainHome;