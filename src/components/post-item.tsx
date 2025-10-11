import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/constant/types";

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <Link
      href={`/blog/${post.slug ? encodeURIComponent(post.slug) : post.id}`}
      className="block"
    >
      <div className="bg-white hover:shadow-[0_0_10px_5px_rgba(30,136,229,0.3)] transition duration-300 rounded-lg shadow-md hover:scale-105  overflow-hidden">
        <div className="relative w-full h-48">
          <Image
            src={post.image || "/default-post.jpg"}
            alt={post.title || "Post Image"}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {post.title}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html: post.excerpt || post.content || "",
            }}
            className="text-sm text-gray-500 line-clamp-2 mt-1"
          />
          <div className="text-xs text-gray-400 mt-2">
            {post.created_at
              ? new Date(post.created_at).toLocaleDateString()
              : ""}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
