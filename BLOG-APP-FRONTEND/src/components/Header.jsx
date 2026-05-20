import { NavLink } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { navbarClass, navContainerClass, navBrandClass, navLinksClass, navLinkClass, navLinkActiveClass } from "../styles/common";

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <span className={navBrandClass}>BlogApp</span>
        <ul className={navLinksClass}>
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Home
            </NavLink>
          </li>

          {!isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to={
                    currentUser?.role === "USER" ? "/user-dashboard" : 
                    currentUser?.role === "AUTHOR" ? "/author-dashboard" : 
                    "/admin-dashboard"
                  }
                  className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                >
                  Dashboard
                </NavLink>
              </li>
              {currentUser?.role === "AUTHOR" && (
                <li>
                  <NavLink
                    to="/add-article"
                    className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
                  >
                    Add Article
                  </NavLink>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className={navLinkClass}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
