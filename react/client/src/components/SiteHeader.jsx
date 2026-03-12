import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/blog1", label: "GPT Astro Lab" },
  { to: "/blog2", label: "Interview Buddy" },
  { to: "/blog3", label: "Resume Builder" }
];

export default function SiteHeader() {
  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <NavLink className="brand" to="/">
          Summitize Journal
        </NavLink>
        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
