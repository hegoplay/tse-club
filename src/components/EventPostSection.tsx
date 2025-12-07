"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Images } from "@/constant/image";

interface EventPostsSectionProps {
  eventPosts: any[];
}

export default function EventPostsSection({
  eventPosts,
}: EventPostsSectionProps) {
  const { t } = useTranslation("common");
  const bgColors = ["#fef79d", "#bdf4c9", "#ffd6e8"];

  if (!eventPosts || eventPosts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="text-center mb-10">
        <h3 className="text-4xl font-bold text-gray-900 mb-3">
          {t("EVENT POSTS") || "Event News & Updates"}
        </h3>
      </div>
      <div className="grid grid-cols-1 mx-auto max-w-[1400px] md:grid-cols-3 gap-8">
        {eventPosts.slice(0, 3).map((post: any, i: number) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden flex flex-col shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
            style={{ backgroundColor: bgColors[i % bgColors.length] }}
          >
            <div className="w-full h-56 relative overflow-hidden">
              <Image
                src={post.featureImageUrl || Images.emptyImage.src}
                alt={post.title || ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="flex flex-col text-left p-7 flex-grow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <p className="text-sm text-gray-700 font-medium">
                  {formatDate(post.postTime).formattedDate}
                </p>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h4>

              <Link
                href={`/posts/${post.id}`}
                className="mt-auto bg-gray-900 text-white rounded-full px-6 py-3 font-semibold self-start hover:bg-gray-800 transition-all text-sm shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-2 group"
              >
                {t("READ MORE") || "Read more"}
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
