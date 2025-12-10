"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPublicPost } from "@/modules/services/postService";
import { Post } from "@/constant/types";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Image, Pagination } from "antd"; // 1. Import Pagination

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 2. Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 15;

  const { t } = useTranslation("common");

  // Reset về trang 1 khi người dùng tìm kiếm từ khóa mới
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    // Debounce search
    const handler = setTimeout(() => {
      const fetchPosts = async () => {
        try {
          setLoading(true);
          const res = await getPublicPost({
            page: currentPage - 1, // API thường bắt đầu từ 0, UI bắt đầu từ 1
            size: pageSize,
            sort: "postTime,desc",
            searchs: ["title"],
            searchValues: ["*" + searchTerm + "*"],
          });

          setPosts(res._embedded?.postWrapperDtoList || []);
          
          // 3. Cập nhật tổng số bài viết từ response (giả sử API trả về cấu trúc Spring Pageable chuẩn)
          // Bạn cần kiểm tra xem response thực tế trả về field nào (page.totalElements hay totalPages)
          if (res.page) {
            setTotalElements(res.page.totalElements); 
          }
          
        } catch (err) {
          console.error("Error fetching posts:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }, 400); 

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, currentPage]); // Thêm currentPage vào dependency

  // Hàm xử lý khi chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Cuộn lên đầu danh sách bài viết cho mượt mà
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f4faf4] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-500 text-white py-12 px-4 mx-4 md:mx-6 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold">
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
          ) : posts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {posts.map((post, index) => (
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
                    {/* Giữ nguyên logic hiển thị ảnh của bạn */}
                    {post.image && (
                      <div className="w-full h-48 relative rounded-2xl overflow-hidden mb-4">
                        <Image
                          src={post.image}
                          alt={post.title || ""}
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          preview={false}
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

                    <h2 className="font-bold text-lg md:text-xl text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Lưu ý: Bạn đang render ảnh 2 lần trong code gốc (post.image ở trên và featureImageUrl ở dưới). 
                        Tôi giữ nguyên, nhưng bạn nên cân nhắc chỉ dùng 1 cái. */}
                    <Image
                      src={post.featureImageUrl || "/images/default-post.webp"}
                      alt={post.title || ""}
                      className="object-cover rounded-2xl mb-4 w-100 h-50"
                      preview={false}
                    />

                    <Link href={`/posts/${post.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="bg-green-500 text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-gradient-to-r hover:from-green-500 hover:via-teal-500 hover:to-emerald-300 transition-all duration-500 ease-in-out mt-2"
                      >
                        {t("Read more")}
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* 4. Component Phân trang */}
              <div className="flex justify-center mt-12">
                <Pagination
                  current={currentPage}
                  total={totalElements}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  showSizeChanger={false} // Tắt chọn số lượng item/trang nếu không cần
                  className="custom-pagination" // Có thể style thêm bằng CSS
                />
              </div>
            </>
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
        </motion.aside>
      </div>
    </div>
  );
}