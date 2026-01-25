import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [openNotification, setOpenNotification] = useState(false);
  const isChatPage = location.pathname.startsWith("/chat");

  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification,
  );

  const [open, setOpen] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${API}/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const handleNav = (type) => {
    if (type === "Logout") logoutHandler();
    else if (type === "Create") setOpen(true);
    else if (type === "Profile") navigate(`/profile/${user?._id}`);
    else if (type === "Home") navigate("/");
    else if (type === "Messages") navigate("/chat");
    else if (type === "Explore") navigate("/explore");
    else if (type === "Search") navigate("/search");
    else if (type === "Notifications") {
      setOpenNotification((prev) => !prev);
    }
  };

  const isActive = (path) => location.pathname === path;

  /* ================= DESKTOP SIDEBAR ================= */
  const desktopItems = [
    { icon: <Home />, text: "Home", path: "/" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore", path: "/explore" },
    { icon: <MessageCircle />, text: "Messages", path: "/chat" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <>
      {/* ================= DESKTOP (INSTAGRAM STYLE) ================= */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:z-10 md:flex md:h-screen md:w-[240px] md:flex-col md:border-r md:bg-white md:px-4">
        <h1 className="my-8 px-3 font-bold text-2xl">Pixagram</h1>

        {desktopItems.map((item) => (
          <div
            key={item.text} // ✅ UNIQUE KEY
            onClick={() => handleNav(item.text)}
            className="relative flex items-center gap-4 rounded-lg px-3 py-3 my-1 cursor-pointer"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}

        {openNotification && (
          <div className="absolute left-60 top-32 w-80 rounded-lg border bg-white shadow-lg z-50 p-3">
            <h3 className="font-semibold mb-2">Notifications</h3>

            {likeNotification.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications</p>
            ) : (
              likeNotification.map((n) => (
                <div key={n._id} className="flex items-center gap-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={n.userDetails?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {n.userDetails?.username}
                    </span>{" "}
                    liked your post
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </aside>

      {/* ================= MOBILE BOTTOM NAV (INSTAGRAM) ================= */}
      {!isChatPage && (
      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-between border-t bg-white px-6 py-2 md:hidden">
        {/* Home */}
        <button onClick={() => navigate("/")}>
          <Home className={isActive("/") ? "stroke-2" : ""} />
        </button>

        <button onClick={() => navigate("/chat")}>
          <MessageCircle />
        </button>

        {/* Create (CENTER BIG ICON) */}
        <button
          onClick={() => setOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full border"
        >
          <PlusSquare />
        </button>

        {/* Notifications */}
        <button
          onClick={() => setOpenNotification((prev) => !prev)}
          className="relative"
        >
          <Heart />
          {likeNotification.length > 0 && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600"></span>
          )}
        </button>

        {/* Profile */}
        <button onClick={() => navigate(`/profile/${user?._id}`)}>
          <Avatar className="h-6 w-6">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </nav>
      )}

      {/* ================= MOBILE NOTIFICATIONS ================= */}
      {openNotification && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-2xl p-4 max-h-[60vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Notifications</h3>
              <button
                onClick={() => setOpenNotification(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>

            {likeNotification.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No new notifications
              </p>
            ) : (
              likeNotification.map((n) => (
                <div key={n._id} className="flex items-center gap-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={n.userDetails?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">
                    <span className="font-semibold">
                      {n.userDetails?.username}
                    </span>{" "}
                    liked your post
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;
