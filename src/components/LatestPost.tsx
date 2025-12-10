"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getPosts, getPublicPost } from "@/modules/services/postService";
import { Post } from "@/constant/types";
import { Loader2 } from "lucide-react";
import { Image } from "antd";
import { useTranslation } from "react-i18next";

export default function LatestPost() {
  const { t } = useTranslation("common");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const bgColors = ["#fef79d", "#bdf4c9", "#ffd6e8"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPublicPost({
          page: 0,
          size: 3,
          sort: "postTime,desc",
        });
        setPosts(res._embedded?.postWrapperDtoList || []);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="w-full px-4 py-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        {t("The latest news and stories")}
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="rounded-3xl overflow-hidden flex flex-col shadow-sm transition-transform duration-200 hover:-translate-y-1"
              style={{ backgroundColor: bgColors[i % bgColors.length] }}
            >
              <div className="relative">
                <Image
                  src={post.featureImageUrl || "/images/default-post.webp"}
                  alt={post.title || ""}
                  preview={false}
                  className="object-cover rounded-t-3xl"
                />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col text-left p-6 flex-grow">
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-800 mb-6">
                  {new Date(post.postTime || "").toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <Link
                  href={`/posts/${post.id}`}
                  className="mt-auto bg-black text-white rounded-full px-5 py-2 font-semibold self-start hover:opacity-80 transition"
                >
                  {t("Read more")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && posts.length > 0 && (
        <div className="mt-12">
          <Link
            href="/posts"
            className="bg-black text-white rounded-full px-8 py-3 font-bold hover:opacity-80 transition"
          >
            {t("View all posts")}
          </Link>
        </div>
      )}
    </section>
  );
}
