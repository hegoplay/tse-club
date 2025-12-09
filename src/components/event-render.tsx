"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, MapPin, UserCheck, Users, X } from "lucide-react";
import {
  registerForEvent as triggerRegisterForEvent,
  registerForEventWithoutLogin,
  getEventPublicById,
} from "@/modules/services/eventService";
import { toast } from "sonner";
import FlipNumbers from "react-flip-numbers";
import { useTranslation } from "react-i18next";
import CheckInSection from "./CheckInSection";
import ReviewSection from "./ReviewSection";
import EventPostsSection from "./EventPostSection";
import { formatAllowedParticipants } from "@/lib/allowedParticipantsUtils";
import { Badge } from "antd";
import { log } from "console";
import { validateEmail } from "@/lib/utils";
import { UserShortInfoResponseDto } from "@/constant/types";
import RegisteredButton from "./events/buttons/registeredButton";

interface EventRenderProps {
  eventData: any;
}

export default function EventRender({
  eventData: initialEventData,
}: EventRenderProps) {
  const { t } = useTranslation("common");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [userStatus, setUserStatus] = useState<string>("");
  const [eventData, setEventData] = useState(initialEventData);
  const [isRefetching, setIsRefetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [currentRegistered, setCurrentRegistered] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestFormData, setGuestFormData] = useState({
    fullName: "",
    email: "",
    dateOfBirth: "",
    nickname: "",
  });

  // Refetch event data on client side to get correct user-related values
  useEffect(() => {
    const refetchEventData = async () => {
      if (typeof window === "undefined" || !eventData?.id) return;

      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);

      if (!user) return;

      try {
        setIsRefetching(true);
        const freshData = await getEventPublicById(eventData.id);
        if (freshData) {
          setEventData(freshData);
        }
      } catch (error) {
        console.error("Error refetching event data:", error);
      } finally {
        setIsRefetching(false);
      }
    };

    refetchEventData();
  }, [eventData?.id]);

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
    userAsAttendee,
    eventPosts,
    isPublic,
    limitRegister,
    registrationDeadline,
    allowedType,
    single,
  } = eventData;

  useEffect(() => {
    setCurrentRegistered(eventData.currentRegistered || 0);
  }, [eventData.currentRegistered]);

  useEffect(() => {
    if (!location?.startTime) return;
    let start = new Date(location.startTime).getTime();

    if (start < Date.now()) {
      start = new Date(location.endTime).getTime();
    }

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
    let user =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user) {
      setUserStatus("guest");
      return;
    }
    const userData = JSON.parse(user) as UserShortInfoResponseDto;

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
        else if (
          eventData.allowedType &&
          !(eventData.allowedType & userData.type)
        ) {
          setUserStatus("not_allowed");
        } else setUserStatus("none");
      } catch (err) {
        console.error("Error checking user event status:", err);
      }
    };
    fetchStatus();
  }, [id, isHost, userAsOrganizer, userAttendeeStatus, userAsAttendee]);

  const getBadge = (key: string, value: string) => {
    return (
      <Badge
        key={key}
        count={value}
        style={{
          backgroundColor: "transparent",
          color: "#000",
          fontSize: "var(--text-sm)",
          fontWeight: "600",
        }}
        className="text-sm px-3 py-1"
      />
    );
  };

  const generateUserTypeBadge = (type: number) => {
    const keys = ["student", "member", "teacher", "admin"];
    const values = [
      "Sinh viên",
      "Thành viên CLB",
      "Giảng viên",
      "Quản trị viên",
    ];
    let badges = [];
    for (let i = 0; i < keys.length; i++) {
      if ((type & (1 << i)) === 0) continue;
      badges.push(getBadge(keys[i], values[i]));
    }
    return <>{badges.map((badge) => badge)}</>;
  };

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

  const isSingleEvent = () => {
    return single;
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const res = await triggerRegisterForEvent(id);
      console.log("register response:", res);
      toast.success(t("Registration successful"));
      setUserStatus("registered");
      setCurrentRegistered((prev) => prev + 1);
      const refreshedData = await getEventPublicById(id);
      if (refreshedData) {
        setEventData(refreshedData);
      }
    } catch {
      toast.error(t("Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setLoading(true);
      const res = await triggerRegisterForEvent(id);
      console.log("unregister response:", res);
      toast.success(t("Unregistration successful"));
      setUserStatus("none");
      setCurrentRegistered((prev) => prev - 1);
      const refreshedData = await getEventPublicById(id);
      if (refreshedData) {
        setEventData(refreshedData);
      }
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

    if (!validateEmail(email)) {
      toast.error(t("Please enter a valid email address"));
      return;
    }

    try {
      setLoading(true);
      const res = await registerForEventWithoutLogin(id, guestFormData);
      console.log("Guest register response:", res);
      if (res?.detail) {
        throw new Error(res.detail || "Registration failed");
      }
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
    const user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "{}")
        : null;
    // console.log("allowedType", allowedType, "user.type", user?.type);
    const common =
      "font-semibold rounded-full px-6 py-3 transition-all text-white";
    if (!isSingleEvent()) {
      return (
        <button disabled className={`${common} bg-gray-500`}>
          {t("not available for multi events")}
        </button>
      );
    }
    if (isRegistrationClosed()) {
      return (
        <button disabled className={`${common} bg-red-500`}>
          {t("Registration closed")}
        </button>
      );
    }

    if (isRegistrationFull() && eventData.userAsAttendee == null) {
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
        return (
          <RegisteredButton
            handleUnregister={handleUnregister}
            common={common}
          />
        );
      case "checked":
        return (
          <button disabled className={`${common} bg-blue-600`}>
            {t("CHECKED_IN")}
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
      case "not_allowed":
        return (
          <button disabled className={`${common} bg-black hover:opacity-80`}>
            {t("You are not allowed to register")}
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

  const afterStartTime = () => {
    const now = Date.now();
    return now >= new Date(location?.startTime).getTime();
  };

  const mapperBgEventStatusColor = () => {
    if (done) return "bg-green-500";
    if (afterStartTime()) return "bg-green-500";
    return "bg-yellow-400 text-gray-900";
  };

  const renderUpcomingTimeCounter = () => {
    return (
      <>
        <p className="text-sm opacity-80 mb-2">
          {afterStartTime() ? t("ENDED IN") : t("STARTS IN")}
        </p>
        <p className="text-3xl font-bold mb-4">
          {countdown.days} <span className="text-lg">{t("DAYS")}</span>
        </p>
        <div className="flex justify-center gap-1">
          <FlipNumbers
            height={20}
            width={18}
            color="white"
            background="rgba(255,255,255,0.1)"
            play
            perspective={200}
            numbers={`${String(countdown.hours).padStart(2, "0")}:${String(
              countdown.minutes
            ).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`}
          />
        </div>
      </>
    );
  };

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
        <div className="md:w-1/3 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white flex flex-col justify-between items-center p-8 rounded-3xl md:mr-8 mb-6 md:mb-0 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-4">
              <CalendarDays className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold mb-2">{category || "Event"}</p>
            <p
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${mapperBgEventStatusColor()}`}
            >
              {done
                ? t("FINISHED")
                : afterStartTime()
                ? t("ONGOING")
                : t("UPCOMING")}
            </p>

            <div className="mt-8 text-center w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              {renderUpcomingTimeCounter()}
            </div>
          </div>

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

        {/* Right Content */}
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

            <div
              dangerouslySetInnerHTML={{ __html: description || "" }}
              className="text-base text-gray-700 mb-8 leading-relaxed bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-gray-100"
            />

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
              {!isPublic && allowedType != 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-3 rounded-lg">
                      <UserCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        {t("user type allowed")}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {generateUserTypeBadge(allowedType)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            {renderButton()}
          </div>
        </div>
      </motion.div>

      {/* Interactive Sections Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CheckInSection
          eventId={id}
          userAsAttendee={userAsAttendee}
          isLoggedIn={isLoggedIn}
          startTime={location?.startTime}
          endTime={location?.endTime}
        />
        <ReviewSection
          eventId={id}
          category={category}
          userAsAttendee={userAsAttendee}
        />
      </div>

      {/* Event Posts Section */}
      <EventPostsSection eventPosts={eventPosts} />
    </div>
  );
}
