import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const API = import.meta.env.VITE_API_URL;

  // ✅ ids store kar rahe hain
  const [followingIds, setFollowingIds] = useState(
    user?.following || []
  );

  const followUnfollowHandler = async (userId) => {
    try {
      const res = await axios.post(
        `${API}/user/followorunfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setFollowingIds((prev) =>
          prev.includes(userId)
            ? prev.filter((id) => id !== userId)
            : [...prev, userId]
        );

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  // 🔐 SAFETY
  if (!Array.isArray(suggestedUsers) || suggestedUsers.length === 0) {
    return (
      <div className="my-10 text-sm text-gray-500">
        No suggestions available
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      {suggestedUsers.map((u) => (
        <div
          key={u._id}
          className="flex items-center justify-between my-5"
        >
          <div className="flex items-center gap-2">
            <Link to={`/profile/${u._id}`}>
              <Avatar>
                <AvatarImage src={u?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${u._id}`}>{u?.username}</Link>
              </h1>
              <span className="text-gray-600 text-sm">
                {u?.bio || "Bio here..."}
              </span>
            </div>
          </div>

          {/* ✅ FOLLOW / UNFOLLOW */}
          <Button
            size="sm"
            variant={followingIds.includes(u._id) ? "secondary" : "default"}
            onClick={() => followUnfollowHandler(u._id)}
          >
            {followingIds.includes(u._id) ? "Unfollow" : "Follow"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
