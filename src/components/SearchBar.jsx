import { useState, useEffect } from "react";
import axios from "axios";

const SearchBar = ({onSelectUser}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token found");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(`https://chat-app-backend-k80s.onrender.com/api/users`, {
          headers,
        });
        setUsers(response.data); // Assuming API returns an array of user objects
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the async function inside useEffect
  }, []); // Empty dependency array to run once on component mount

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-accent m-1 text-xl font-serif">
        Search users
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {users.map((user) => (
          <li key={user._id} onClick={() => onSelectUser(user)}>
            <div className="alert alert-info text-xl font-serif mb-2 p-2 flex justify-around">
              <span className="flex flex-row justify-between">{user.username} <img src={user.profilePic} className="w-10 h-10 rounded-full"></img></span>
              <hr/>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
