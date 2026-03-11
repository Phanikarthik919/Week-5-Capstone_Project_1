import { NavLink } from "react-router-dom";
import { navbarClass, navContainerClass, navBrandClass, navLinksClass, navLinkClass, navLinkActiveClass } from "../styles/common";

function Header() {
  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <span className={navBrandClass}>BlogApp</span>
        <ul className={navLinksClass}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => isActive ? navLinkActiveClass : navLinkClass}
            >
              Home
            </NavLink>
          </li>
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
        </ul>
      </div>
    </nav>
  );
}

export default Header;
