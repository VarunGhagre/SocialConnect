import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();
  const isAuthor = user?._id === post?.author?._id;
  const [isFollowing, setIsFollowing] = useState(
  post?.author?.followers?.includes(user?._id)
);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const API = import.meta.env.VITE_API_URL;

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`${API}/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${API}/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p,
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(`${API}/post/delete/${post?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id,
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };

  const addToFavoriteHandler = async () => {
    try {
      const res = await axios.get(`${API}/post/${post._id}/bookmark`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed");
    }
  };

  const followUnfollowHandler = async () => {
  try {
    const res = await axios.post(
      `${API}/user/followorunfollow/${post.author._id}`,
      {},
      { withCredentials: true }
    );

    if (res.data.success) {
      setIsFollowing(prev => !prev); // 🔥 MAIN LINE
      toast.success(res.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Action failed");
  }
};

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(`${API}/post/${post?._id}/bookmark`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="my-6 w-full max-w-[95%] sm:max-w-md md:max-w-sm mx-auto px-2 sm:px-0">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Link
          to={`/profile/${post.author?._id}`}
          className="flex items-center gap-2"
        >
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-medium hover:underline cursor-pointer">
              {post.author?.username}
            </h1>

            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {!isAuthor && (
  <Button
    variant="ghost"
    className={`font-bold ${
      isFollowing ? "text-gray-700" : "text-[#0095F6]"
    }`}
    onClick={followUnfollowHandler}
  >
    {isFollowing ? "Unfollow" : "Follow"}
  </Button>
)}

            <Button variant="ghost" onClick={addToFavoriteHandler}>
              Add to favorites
            </Button>
            {user?._id === post?.author._id && (
              <Button onClick={deletePostHandler} variant="ghost">
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* IMAGE */}
      <img
        src={post.image}
        alt="post_img"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      {/* ACTIONS */}
      <div className="flex items-center justify-between my-2 px-1">
        <div className="flex items-center gap-4">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={22}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer"
          />
          <Send className="cursor-pointer" />
        </div>

        <Bookmark onClick={bookmarkHandler} className="cursor-pointer" />
      </div>

      {/* DETAILS */}
      <span className="font-medium block mb-1 text-sm sm:text-base">
        {postLike} likes
      </span>

      <p className="text-sm sm:text-base">
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-xs sm:text-sm text-gray-400 block mt-1"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />

      {/* COMMENT INPUT */}
      <div className="flex items-center justify-between mt-2 gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full bg-transparent"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] text-sm font-medium cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
