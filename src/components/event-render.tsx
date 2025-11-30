"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  MapPin,
  Users,
  CheckCircle,
  Star,
  X,
} from "lucide-react";
import {
  registerForEvent,
  registerForEventWithoutLogin,
  selfCheckIn,
  addReview,
} from "@/modules/services/eventService";
import { toast } from "sonner";
import FlipNumbers from "react-flip-numbers";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";

interface EventRenderProps {
  eventData: any;
}

export default function EventRender({ eventData }: EventRenderProps) {
  const { t } = useTranslation("common");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [userStatus, setUserStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checkInCode, setCheckInCode] = useState("");
  const [review, setReview] = useState("");
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [currentRegistered, setCurrentRegistered] = useState(0);
  const [guestFormData, setGuestFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    nickname: "",
  });

  if (!eventData) return <p className="text-gray-500">{t("NO_EVENT_DATA")}</p>;

  const {
    title,
    description,
    category,
    location,
    host,
    done,
    id,
    isHost,
    userAsOrganizer,
    userAttendeeStatus,
    timeStatus,
    userAsAttendee,
    eventPosts,
    isPublic,
    limitRegister,
    registrationDeadline,
  } = eventData;

  const bgColors = ["#fef79d", "#bdf4c9", "#ffd6e8"];

  useEffect(() => {
    setCurrentRegistered(eventData.currentRegistered || 0);
  }, [eventData.currentRegistered]);

  useEffect(() => {
    if (!location?.startTime) return;
    const start = new Date(location.startTime).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = start - now;

      if (distance <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [location?.startTime]);

  useEffect(() => {
    const user =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user) {
      setUserStatus("guest");
      return;
    }

    const fetchStatus = async () => {
      try {
        if (isHost) setUserStatus("host");
        else if (userAsOrganizer?.roles?.includes("MODIFY"))
          setUserStatus("organizer");
        else if (
          userAttendeeStatus === "REGISTERED" ||
          userAsAttendee?.status === "REGISTERED"
        )
          setUserStatus("registered");
        else if (
          userAttendeeStatus === "CHECKED" ||
          userAsAttendee?.status === "CHECKED"
        )
          setUserStatus("checked");
        else setUserStatus("none");
      } catch (err) {
        console.error("Error checking user event status:", err);
      }
    };

    fetchStatus();
  }, [id, isHost, userAsOrganizer, userAttendeeStatus, userAsAttendee]);

  const isRegistrationClosed = () => {
    if (registrationDeadline) {
      const deadline = new Date(registrationDeadline).getTime();
      return Date.now() > deadline;
    }
    return false;
  };

  const isRegistrationFull = () => {
    return limitRegister && currentRegistered >= limitRegister;
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerForEvent(id);
      toast.success(t("Registration successful"));
      setUserStatus("registered");
      setCurrentRegistered((prev) => prev + 1);
    } catch {
      toast.error(t("Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestRegister = async () => {
    const { fullName, email, dateOfBirth, nickname } = guestFormData;

    if (!fullName || !email || !dateOfBirth || !nickname) {
      toast.error(t("Please fill all required fields"));
      return;
    }

    try {
      setLoading(true);
      await registerForEventWithoutLogin(id, guestFormData);
      toast.success(
        t("Registration successful! Please check your email for confirmation.")
      );
      setShowGuestModal(false);
      setCurrentRegistered((prev) => prev + 1);
      setGuestFormData({
        fullName: "",
        email: "",
        dateOfBirth: "",
        nickname: "",
      });
    } catch (err: any) {
      toast.error(err?.message || t("Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!checkInCode.trim()) {
      toast.error(t("Please enter check-in code"));
      return;
    }
    try {
      setSubmittingCheckIn(true);
      const response = await selfCheckIn(id, {
        code: checkInCode,
        attendeeId: userAsAttendee?.id || "",
      });

      console.log("Check-in response:", response);
      if (response.status === "200") {
        toast.success(t("Check-in successful!"));
        setUserStatus("checked");
        setCheckInCode("");
      } else {
        const errorMessage = response?.detail || t("Check-in failed");
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        t("Invalid check-in code");
      toast.error(errorMessage);
    } finally {
      setSubmittingCheckIn(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      toast.error(t("Please enter your review"));
      return;
    }
    try {
      setSubmittingReview(true);
      await addReview(id, review);
      toast.success(t("Review submitted successfully!"));
      setReview("");
    } catch (err: any) {
      toast.error(err?.message || t("Failed to submit review"));
    } finally {
      setSubmittingReview(false);
    }
  };

  const startTime = new Date(location?.startTime).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const endTime = new Date(location?.endTime).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const renderButton = () => {
    const common =
      "font-semibold rounded-full px-6 py-3 transition-all text-white";

    if (isRegistrationClosed()) {
      return (
        <button disabled className={`${common} bg-red-500`}>
          {t("Registration closed")}
        </button>
      );
    }

    if (isRegistrationFull()) {
      return (
        <button disabled className={`${common} bg-orange-500`}>
          {t("Registration full")}
        </button>
      );
    }

    switch (userStatus) {
      case "host":
        return (
          <button disabled className={`${common} bg-green-600`}>
            {t("YOU ARE HOST")}
          </button>
        );
      case "organizer":
        return (
          <button disabled className={`${common} bg-purple-600`}>
            {t("YOU ARE ORGANIZER")}
          </button>
        );
      case "registered":
      case "checked":
        return (
          <button disabled className={`${common} bg-blue-600`}>
            {userStatus === "checked"
              ? t("CHECKED_IN") || "Checked In"
              : t("REGISTERED")}
          </button>
        );
      case "guest":
        return isPublic ? (
          <button
            onClick={() => setShowGuestModal(true)}
            className={`${common} bg-black hover:opacity-80`}
          >
            {t("REGISTER NOW")}
          </button>
        ) : (
          <button
            onClick={() => toast.info(t("PLEASE LOGIN"))}
            className={`${common} bg-gray-500`}
          >
            {t("LOGIN TO JOIN")}
          </button>
        );
      default:
        return (
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`${common} bg-black hover:opacity-80`}
          >
            {loading ? t("REGISTERING") : t("REGISTER NOW")}
          </button>
        );
    }
  };

  const canCheckIn =
    (timeStatus === "ONGOING" || timeStatus === "COMPLETED") &&
    (userAsAttendee?.status === "REGISTERED" || userStatus === "registered");

  const canReview =
    category === "SEMINAR" &&
    timeStatus === "COMPLETED" &&
    (userAsAttendee?.status === "CHECKED" || userStatus === "checked");

  return (
    <div className="min-h-[700px] flex flex-col">
      {/* Guest Registration Modal */}
      <AnimatePresence>
        {showGuestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowGuestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("Register for Event")}
                </h3>
                <button
                  onClick={() => setShowGuestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Full Name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guestFormData.fullName}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("Enter your full name")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Email")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={guestFormData.email}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("Enter your email")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Date of Birth")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={guestFormData.dateOfBirth}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("Nickname")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guestFormData.nickname}
                    onChange={(e) =>
                      setGuestFormData({
                        ...guestFormData,
                        nickname: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("Enter your nickname")}
                  />
                </div>

                <button
                  onClick={handleGuestRegister}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("REGISTERING")}
                    </span>
                  ) : (
                    t("Submit Registration")
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-xl p-6 md:p-10 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 mb-8 border border-gray-100"
      >
        {/* Left Card - Enhanced */}
        <div className="md:w-1/3 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white flex flex-col justify-between items-center p-8 rounded-3xl md:mr-8 mb-6 md:mb-0 shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-4">
              <CalendarDays className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold mb-2">{category || "Event"}</p>
            <p
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                done ? "bg-green-500" : "bg-yellow-400 text-gray-900"
              }`}
            >
              {done ? t("FINISHED") : t("UPCOMING")}
            </p>

            <div className="mt-8 text-center w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <p className="text-sm opacity-80 mb-2">{t("STARTS IN")}</p>
              <p className="text-3xl font-bold mb-4">
                {countdown.days} <span className="text-lg">{t("DAYS")}</span>
              </p>
              <div className="flex justify-center gap-1">
                <FlipNumbers
                  height={18}
                  width={22}
                  color="white"
                  background="rgba(255,255,255,0.1)"
                  play
                  perspective={200}
                  numbers={`${String(countdown.hours).padStart(
                    2,
                    "0"
                  )}:${String(countdown.minutes).padStart(2, "0")}:${String(
                    countdown.seconds
                  ).padStart(2, "0")}`}
                />
              </div>
            </div>
          </div>

          {/* Stats at bottom */}
          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-80">
                {t("REGISTERED") || "Registered"}
              </p>
              <p className="text-lg font-bold">{currentRegistered}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <CalendarDays className="w-5 h-5 mx-auto mb-1" />
              <p className="text-xs opacity-80">{t("LIMIT") || "Limit"}</p>
              <p className="text-lg font-bold">{limitRegister || "∞"}</p>
            </div>
          </div>
        </div>

        {/* Right Content - Enhanced */}
        <div className="md:w-2/3 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight flex-1">
                {title}
              </h2>
              {isPublic && (
                <span className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold whitespace-nowrap">
                  {t("PUBLIC") || "Public"}
                </span>
              )}
            </div>

            {/* Description with better styling */}
            <div
              dangerouslySetInnerHTML={{ __html: description || "" }}
              className="text-base text-gray-700 mb-8 leading-relaxed bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-gray-100"
            />

            {/* Event Details - Better Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {t("START")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {startTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {t("END")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {endTime}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">
                      {t("LOCATION")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {location?.destination}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      {t("HOST")}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {host?.fullName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {eventData.plans && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  {t("EVENT_PLAN") || "Event Plan"}
                </h4>
                <p className="text-sm text-gray-700">{eventData.plans}</p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center md:justify-start">
            {renderButton()}
          </div>
        </div>
      </motion.div>

      {/* Interactive Sections Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Check-in Section */}
        {true && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl shadow-lg p-8 border border-green-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-500 p-3 rounded-xl shadow-md">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("CHECK_IN") || "Check-in"}
                </h3>
                <p className="text-sm text-green-700">
                  {t("Confirm your attendance")}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
              {t("Enter your check-in code to confirm attendance")}
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={checkInCode}
                onChange={(e) => setCheckInCode(e.target.value)}
                placeholder={t("Enter code (e.g., 999999)")}
                className="w-full px-5 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono bg-white"
              />
              <button
                onClick={handleCheckIn}
                disabled={submittingCheckIn}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submittingCheckIn ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("Checking...")}
                  </span>
                ) : (
                  t("Check-in Now")
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Review Section */}
        {true && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-amber-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-amber-500 p-3 rounded-xl shadow-md">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t("Review Event")}
                </h3>
                <p className="text-sm text-amber-700">
                  {t("Share your experience")}
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-5 text-sm leading-relaxed">
              {t("Share your thoughts about this seminar")}
            </p>
            <div className="flex flex-col gap-3">
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder={t("Write your review...")}
                className="w-full px-5 py-4 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-h-[140px] resize-none bg-white"
              />
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {submittingReview ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("SUBMITTING") || "Submitting..."}
                  </span>
                ) : (
                  t("SUBMIT_REVIEW") || "Submit Review"
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Event Posts Section */}
      {eventPosts && eventPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-10">
            <h3 className="text-4xl font-bold text-gray-900 mb-3">
              {t("EVENT_POSTS") || "Event News & Updates"}
            </h3>
            <p className="text-gray-600">
              {t("LATEST_NEWS") ||
                "Stay updated with the latest news and announcements"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                {post.featureImageUrl && (
                  <div className="w-full h-56 relative overflow-hidden">
                    <Image
                      src={post.featureImageUrl}
                      alt={post.title || ""}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                )}
                <div className="flex flex-col text-left p-7 flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    <p className="text-sm text-gray-700 font-medium">
                      {new Date(
                        post.postTime || post.createdAt
                      ).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  <div
                    className="text-sm text-gray-700 mb-6 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html:
                        post.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 120) + "..." || "",
                    }}
                  />
                  <Link
                    href={`/posts/${post.id}`}
                    className="mt-auto bg-gray-900 text-white rounded-full px-6 py-3 font-semibold self-start hover:bg-gray-800 transition-all text-sm shadow-md hover:shadow-lg transform hover:scale-105 inline-flex items-center gap-2 group"
                  >
                    {t("READ_MORE") || "Read more"}
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
      )}
    </div>
  );
}
