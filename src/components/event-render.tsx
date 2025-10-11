"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Users } from "lucide-react";
import {
  getEventById,
  registerForEvent,
} from "@/modules/services/eventService";
import { toast } from "sonner";
import FlipNumbers from "react-flip-numbers";
import { useTranslation } from "react-i18next";

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
  } = eventData;

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
    const user = localStorage.getItem("user");
    if (!user) {
      setUserStatus("guest");
      return;
    }

    const fetchStatus = async () => {
      try {
        if (isHost) setUserStatus("host");
        else if (userAsOrganizer?.roles?.includes("MODIFY"))
          setUserStatus("organizer");
        else if (userAttendeeStatus === "REGISTERED")
          setUserStatus("registered");
        else if (userAttendeeStatus === "PENDING") setUserStatus("pending");
        else setUserStatus("none");
      } catch (err) {
        console.error("Error checking user event status:", err);
      }
    };

    fetchStatus();
  }, [id]);

  // 🟢 Đăng ký tham gia
  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerForEvent(id);
      toast.success(t("REGISTER_SUCCESS"));
      setUserStatus("pending");
    } catch {
      toast.error(t("REGISTER_FAILED"));
    } finally {
      setLoading(false);
    }
  };

  // 🕓 Format thời gian
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

  // 🟡 Button hiển thị
  const renderButton = () => {
    const common =
      "font-semibold rounded-full px-6 py-3 transition-all text-white";
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
          <button disabled className={`${common} bg-blue-600`}>
            {t("REGISTERED")}
          </button>
        );
      case "pending":
        return (
          <button disabled className={`${common} bg-yellow-500`}>
            {t("PENDING")}
          </button>
        );
      case "guest":
        return (
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-lg p-4 md:p-8 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300"
    >
      <div className="md:w-1/7 bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex flex-col justify-center md:justify-start items-center p-6 md:pt-15 rounded-2xl md:mr-8 mb-6 md:mb-0">
        <CalendarDays className="w-10 h-10 mb-3" />
        <p className="text-lg font-semibold">{category || "Event"}</p>
        <p
          className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
            done ? "bg-green-500" : "bg-yellow-500"
          }`}
        >
          {done ? t("FINISHED") : t("UPCOMING")}
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm mb-1">{t("STARTS IN")}</p>
          <p className="text-lg font-bold">
            {countdown.days} {t("DAYS")}
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <FlipNumbers
              height={15}
              width={13}
              color="white"
              background="transparent"
              play
              perspective={100}
              numbers={`${String(countdown.hours).padStart(2, "0")}:${String(
                countdown.minutes
              ).padStart(2, "0")}:${String(countdown.seconds).padStart(
                2,
                "0"
              )}`}
            />
          </div>
        </div>
      </div>

      <div className="md:w-2/3 p-4 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <div
            dangerouslySetInnerHTML={{ __html: description || "" }}
            className="text-md text-gray-700 my-6"
          />

          <div className="space-y-2 text-gray-600 text-md">
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>
                <strong>{t("START")}:</strong> {startTime}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>
                <strong>{t("END")}:</strong> {endTime}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>
                <strong>{t("LOCATION")}:</strong> {location?.destination}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                <strong>{t("HOST")}:</strong> {host?.fullName}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center md:justify-start">
          {renderButton()}
        </div>
      </div>
    </motion.div>
  );
}
