import axios from "axios";
import { Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API}/user/search?q=${query}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        console.log(error);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Search Input */}
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
        <SearchIcon size={18} className="text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search users"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Results */}
      <div className="mt-4">
        {users.length === 0 && query && (
          <p className="text-sm text-gray-500">No users found</p>
        )}

        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
            className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
          >
            <Avatar>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
