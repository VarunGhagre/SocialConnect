import React from "react";
import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  // ✅ Empty state
  if (!posts || posts.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 text-sm">
          No posts yet 👀
        </p>
      </div>
    );
  }

  return (
    <section className="w-full flex justify-center">
      {/* Feed container */}
      <div
        className="
          w-full
          max-w-[500px]
          sm:max-w-[470px]
          md:max-w-[500px]
          lg:max-w-[520px]
          px-2
          sm:px-0
        "
      >
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default Posts;
