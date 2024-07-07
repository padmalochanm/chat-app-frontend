import { useEffect, useState } from "react";
import ToggleTheme from "./ToggleTheme";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode for decoding JWT tokens

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  useEffect(() => {
    // Check if the token exists in local storage
    const token = localStorage.getItem("authToken");
    setProfilePic(localStorage.getItem("profilePic"));
    if (token) {
      // Decode the token to get expiry time
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds

      // Check if token has expired
      if (decodedToken.exp < currentTime) {
        // Token has expired, perform logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("profilePic");
        setIsLoggedIn(false);
        setProfilePic(""); // Update isLoggedIn state
      } else {
        setIsLoggedIn(true); // Token is valid, user is logged in
      }
    } else {
      setIsLoggedIn(false);
      setProfilePic(""); // No token found, user is not logged in
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false); // Update isLoggedIn state
    setProfilePic("");
    window.location.reload(); // Reload the window
  };

  return (
    <div className="navbar bg-base-200 mb-3">
      <div className="flex-1">
        <a className="btn btn-ghost text-4xl font-serif">Chat-App</a>
      </div>
      <div className="flex-none space-x-8">
        <ToggleTheme />
        {isLoggedIn && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-16 rounded-full">
                <img
                  alt="User avatar"
                  src={profilePic}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
