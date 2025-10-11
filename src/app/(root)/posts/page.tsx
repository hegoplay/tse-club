"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublicPost } from "@/modules/services/postService";
import { Post } from "@/constant/types";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation("common");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPublicPost({
          page: 0,
          size: 9,
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

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4faf4] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-12 px-4 mx-4 md:mx-6 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            {t("Welcome to the Code Club Blog")}
          </h1>
          <p className="text-base md:text-lg mt-3 opacity-90">
            {t("Stay inspired with stories, tips, and updates from our club.")}
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto mt-12 px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <p className="text-center text-gray-600">{t("Loading posts...")}</p>
          ) : filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {post.image && (
                    <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={post.image}
                        alt={post.title || ""}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(post.postTime || "").toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <h2 className="font-extrabold text-lg md:text-xl text-gray-900 mb-2">
                    {post.title}
                  </h2>

                  {/* 📜 Excerpt */}
                  <p className="text-gray-700 text-sm md:text-base line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  {/* 🔗 Read more */}
                  <Link href={`/posts/${post.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="bg-green-500 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-gradient-to-r hover:from-green-500 hover:via-teal-500 hover:to-emerald-300 transition-all duration-500 ease-in-out"
                    >
                      {t("Read more")}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">{t("No posts found.")}</p>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-2">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input
                type="text"
                placeholder={t("Search the blog") || ""}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none text-sm text-gray-700 bg-transparent"
              />
            </div>
          </div>

          {/* 🏷 Categories */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-lg md:text-xl mb-4">
              {t("Categories")}
            </h3>
            <ul className="space-y-2 text-gray-800 font-medium text-sm md:text-base">
              <li>{t("Code Club news")}</li>
              <li>{t("Community Stories")}</li>
              <li>{t("Code Club resources")}</li>
              <li>{t("Events")}</li>
              <li>{t("Helpful tips")}</li>
            </ul>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
