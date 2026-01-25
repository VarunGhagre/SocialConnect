import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector(store => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

 return (
  <div className="flex max-w-5xl justify-center mx-auto px-4 sm:px-6 md:pl-10">
    <div className="flex flex-col gap-12 sm:gap-20 py-6 sm:p-8 w-full">

      {/* ================= PROFILE HEADER ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">

        {/* AVATAR */}
        <section className="flex items-center justify-center">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={userProfile?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>

        {/* USER INFO */}
        <section>
          <div className="flex flex-col gap-4 sm:gap-5">

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-medium">
                {userProfile?.username}
              </span>

              {isLoggedInUserProfile ? (
                <>
                  <Link to="/account/edit">
                    <Button variant="secondary" className="h-8">
                      Edit profile
                    </Button>
                  </Link>
                  <Button variant="secondary" className="h-8">
                    View archive
                  </Button>
                  <Button variant="secondary" className="h-8">
                    Ad tools
                  </Button>
                </>
              ) : (
                isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )
              )}
            </div>

            {/* STATS */}
            <div className="flex gap-6 text-sm">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers.length}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following.length}
                </span>{" "}
                following
              </p>
            </div>

            {/* BIO */}
            <div className="flex flex-col gap-1 text-sm">
              <span className="font-semibold">
                {userProfile?.bio || "bio here..."}
              </span>

              <Badge variant="secondary" className="w-fit">
                <AtSign className="w-4 h-4" />
                <span className="pl-1">{userProfile?.username}</span>
              </Badge>

            </div>
          </div>
        </section>
      </div>

      {/* ================= POSTS SECTION ================= */}
      <div className="border-t border-gray-200 pt-4">

        {/* TABS */}
        <div className="flex justify-center gap-8 text-xs sm:text-sm">
          <span
            className={`py-3 cursor-pointer ${
              activeTab === "posts" ? "font-bold" : ""
            }`}
            onClick={() => handleTabChange("posts")}
          >
            POSTS
          </span>
          <span
            className={`py-3 cursor-pointer ${
              activeTab === "saved" ? "font-bold" : ""
            }`}
            onClick={() => handleTabChange("saved")}
          >
            SAVED
          </span>
          <span className="py-3 cursor-pointer">REELS</span>
          <span className="py-3 cursor-pointer">TAGS</span>
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-3 gap-[2px] sm:gap-1">
          {displayedPost?.map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              <img
                src={post.image}
                alt="postimage"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition">
                <div className="flex items-center gap-4 text-white text-sm">
                  <div className="flex items-center gap-1">
                    <Heart size={18} />
                    {post?.likes.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={18} />
                    {post?.comments.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
);
}

export default Profile