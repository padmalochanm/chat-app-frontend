import { useState } from "react";
import axios from "axios";

const Search = ({ onSelectUser }) => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const fetchData = async (value) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`http://localhost:8000/api/users`, {
        headers,
      });
      const results = response.data.filter((user) => {
        return (
          value &&
          user &&
          user.username &&
          user.username.toLowerCase().includes(value)
        );
      });
      setUsers(results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (value) => {
    setInput(value.target.value);
    fetchData(value.target.value);
  };
  return (
    <div>
      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={input}
          onChange={handleChange}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {input && users.length > 0 && (
        <ul className="menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow absolute">
          {users.map((user) => (
            <li key={user._id} onClick={() => onSelectUser(user)}>
              <div className="alert alert-info text-xl font-serif mb-2 p-2 flex justify-around">
                <span className="flex flex-row justify-between">
                  {user.username}{" "}
                  <img
                    src={user.profilePic}
                    className="w-10 h-10 rounded-full"
                  ></img>
                </span>
                <hr />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
