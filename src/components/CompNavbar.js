import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { checkAuth } from "./CompCheckAuth";

export default function CompNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState();

  useEffect(() => {
    checkAuth().then((data) => {
      setIsLoggedIn(data.loggedIn);
      setRole(data.role)
    });
  }, []);

  const linkActive = "text-blue-700";
  return (
    <nav className="flex  items-center justify-between p-4 bg-white shadow">
      <div className="flex lg:flex-1">
        <a href="/" className="">
          <span className="sr-only">Your Company</span>
          <img alt="" src="../logo.svg" className="h-8 w-max" />
        </a>
      </div>

      <div className="flex gap-4">
        <NavLink to="/" className={({ isActive }) => isActive ? linkActive : ""}>Home</NavLink>

        {isLoggedIn && [1].includes(role) && <NavLink to="/dashboard" className={({ isActive }) => isActive ? linkActive : ""}>Dashboard</NavLink>}

        {isLoggedIn && <NavLink to="/profile" className={({ isActive }) => isActive ? linkActive : ""}>Profile</NavLink>}

        {!isLoggedIn && <NavLink to="/login" className={({ isActive }) => isActive ? linkActive : ""}>Login</NavLink>}

        {isLoggedIn && (
          <button
            onClick={() => {
              fetch("http://localhost/IAS/iasfinals/php/logout.php", {
                credentials: "include",
              }).then(() => {
                setIsLoggedIn(false);
                window.location.href = "/"
              });
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
