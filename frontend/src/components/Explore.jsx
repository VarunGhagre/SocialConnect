import React, { useState } from "react";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";

const Explore = () => {
  const { posts } = useSelector((store) => store.post);

  const [search, setSearch] = useState("");

  // 🔍 filter posts by caption / username
  const filteredPosts = posts.filter((post) =>
    post.caption?.toLowerCase().includes(search.toLowerCase()) ||
    post.user?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen px-4 pt-6">
      {/* SEARCH BAR */}
      <div className="sticky top-0 z-10 bg-white pb-4">
        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search posts or users"
            value={search}
            onChange={(e) => setSearch(e.target.value)} // ✅ LOGIC
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* RESULTS */}
      {filteredPosts.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          No results found
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filteredPosts.map((post) => (
            <div
              key={post._id}
              className="relative aspect-square overflow-hidden bg-gray-200 cursor-pointer"
            >
              <img
                src={post.image}
                alt="post"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
