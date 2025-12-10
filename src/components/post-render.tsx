"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  Menu,
  X,
  ChevronRight,
  MessageCircle,
  Send,
  Edit2,
  Trash2,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  createComment,
  updateComment,
  deleteComment,
} from "@/modules/services/postService";
import { toast } from "sonner";
import Link from "next/link";
import { Comment, Member } from "@/constant/types";
import { Modal, Popconfirm } from "antd";
import LatestPost from "./LatestPost";

interface PostRenderProps {
  pageData: any;
}

const extractTableOfContents = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5"));

  return headings.map((heading, index) => {
    const id = `section-${index}`;
    heading.id = id;
    const level = parseInt(heading.tagName.replace("H", ""), 10);
    return {
      id,
      title: heading.textContent || "",
      level,
    };
  });
};

const PostRender = ({ pageData }: PostRenderProps) => {
  const { t } = useTranslation("common");
  const [isTOCOpen, setIsTOCOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member>();
  const [tableOfContents, setTableOfContents] = useState<
    { id: string; title: string; level: number }[]
  >([]);
  const [normalContent, setNormalContent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(JSON.parse(user));
      }
    }
    console.log("comments", pageData?.comments);
  }, []);

  useEffect(() => {
    if (!pageData) return;

    const postContent = pageData?.content ?? "";
    const toc = extractTableOfContents(postContent);

    let modifiedContent = postContent;
    let index = 0;
    modifiedContent = modifiedContent.replace(
      /<(h[1-5])>/g,
      (_match: any, tag: any) => {
        const tocItem = toc[index] || { id: `section-${index}` };
        index += 1;
        return `<${tag} id="${tocItem.id}">`;
      }
    );

    console.log("modifiedContent", modifiedContent);

    setNormalContent(modifiedContent);
    setTableOfContents(toc);
    setComments(pageData?.comments || []);
  }, [pageData]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      const sections = tableOfContents.map((item) =>
        document.getElementById(item.id)
      );
      const current = sections.find((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 200;
        }
        return false;
      });

      if (current) {
        setActiveSection(current.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setIsTOCOpen(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await createComment(pageData.id, newComment);
      setComments([comment, ...comments]);
      setNewComment("");
      toast.success(
        t("Comment posted successfully") || "Đã đăng bình luận thành công"
      );
    } catch (error) {
      toast.error(t("Failed to post comment") || "Không thể đăng bình luận");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await updateComment(commentId, editContent);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content: editContent } : c
        )
      );
      setEditingCommentId(null);
      setEditContent("");
      toast.success(
        t("Comment updated successfully") || "Đã cập nhật bình luận thành công"
      );
    } catch (error) {
      toast.error(
        t("Failed to update comment") || "Không thể cập nhật bình luận"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success(
        t("Comment deleted successfully") || "Đã xóa bình luận thành công"
      );
    } catch (error) {
      toast.error(t("Failed to delete comment") || "Không thể xóa bình luận");
      console.error(error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString || "");
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return t("Just now") || "Vừa xong";
    if (seconds < 3600)
      return `${Math.floor(seconds / 60)} ${t("minutes ago") || "phút trước"}`;
    if (seconds < 86400)
      return `${Math.floor(seconds / 3600)} ${t("hours ago") || "giờ trước"}`;
    return `${Math.floor(seconds / 86400)} ${t("days ago") || "ngày trước"}`;
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isCommentOwner = (comment: Comment) => {
    return currentUser && comment.commenter?.id === currentUser.id;
  };

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          {t("NO_EVENT_DATA") || "Không có dữ liệu"}
        </p>
      </div>
    );
  }

  // Xác định hình ảnh nền: sử dụng featureImageUrl nếu có, ngược lại dùng gradient mặc định
  const heroBackgroundStyle = pageData.featureImageUrl
    ? {
        backgroundImage: `url(${pageData.featureImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section với hình nền và lớp phủ tối */}
      <div
        className={`relative ${!pageData.featureImageUrl && 'bg-gradient-to-br from-blue-600 to-purple-700'} text-white`}
        style={heroBackgroundStyle}
      >
        {/* Lớp phủ tối để làm nổi bật chữ */}
        {pageData.featureImageUrl && (
          <div className="absolute inset-0 bg-black/50 z-0 blur-2xl"
            
          ></div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pt-28 md:pb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
            {pageData.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-white/90">{t("Written by")}</span>
              <span className="font-semibold">{pageData.writer?.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-white/90">{t("Published")}</span>
              <span className="font-semibold">
                {formatDate(pageData.lastModifiedTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">
                {comments.length} {t("comments")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <p className="mb-2 ml-4">{`→ ${t('Post Content')}`}</p>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          <AnimatePresence>
            {isTOCOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-20"
                onClick={() => setIsTOCOpen(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg font-bold mb-4 text-gray-900">
                    {t("tableOfContents") || "Mục lục"}
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`block w-full text-left py-3 px-4 rounded-lg transition-all ${
                          activeSection === item.id
                            ? "bg-blue-50 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50"
                        } ${item.level === 3 ? "pl-8" : ""}`}
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Article Content */}
          <article className="flex-1 min-w-0">
            {/* Xóa Featured Image ở đây vì đã đưa lên Hero Section */}
            
            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 lg:p-10 mb-8">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-8 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: normalContent }}
              />

              {/* Register CTA for Event/Training */}
              {(pageData.event || pageData.training) && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <Link
                    href={`${
                      pageData.event
                        ? `/events/${pageData.event.id}`
                        : `/training/${pageData.training.id}`
                    }`}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all inline-flex items-center justify-center gap-2 group"
                  >
                    {t("REGISTER NOW") || "Đăng ký ngay"}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                {t("comments")} ({comments.length})
              </h3>

              {/* Comment Input */}
              {isLoggedIn ? (
                <div className="mb-8">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={
                      t("Share your thoughts...") ||
                      "Chia sẻ suy nghĩ của bạn..."
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handlePostComment}
                      disabled={isSubmitting || !newComment.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      {t("Post Comment") || "Đăng bình luận"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-center">
                  {t("Please login to comment") ||
                    "Vui lòng đăng nhập để bình luận"}
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    {t("No comments yet. Be the first to comment!") ||
                      "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"}
                  </p>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.commenter?.fullName || "User"
                        )}`}
                        alt={comment.commenter?.fullName}
                        className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {comment.commenter?.fullName}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(comment.commentTime || "")}
                            </p>
                          </div>
                          {isCommentOwner(comment) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id || "");
                                  setEditContent(comment.content);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <Popconfirm
                                title={t("Delete Comment")}
                                description={
                                  t(
                                    "Are you sure you want to delete this comment?"
                                  ) ||
                                  "Bạn có chắc chắn muốn xóa bình luận này?"
                                }
                                onConfirm={() =>
                                  handleDeleteComment(comment.id || "")
                                }
                                okText={t("Delete") || "Xóa"}
                                cancelText={t("Cancel") || "Hủy"}
                                okButtonProps={{ danger: true }}
                              >
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </Popconfirm>
                            </div>
                          )}
                        </div>

                        {editingCommentId === comment.id ? (
                          <div>
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleEditComment(comment.id || "")
                                }
                                disabled={isSubmitting}
                                className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                              >
                                {t("Save") || "Lưu"}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditContent("");
                                }}
                                className="px-4 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                              >
                                {t("Cancel") || "Hủy"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto">
        <LatestPost />
      </div>
    </div>
  );
};

export default PostRender;