import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  publicSelfCheckIn,
  selfCheckIn,
} from "@/modules/services/eventService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CheckInSectionProps {
  eventId: string;
  userAsAttendee?: any;
  isLoggedIn: boolean;
  startTime: string;
  endTime: string;
}

export default function CheckInSection({
  eventId,
  userAsAttendee,
  isLoggedIn,
  startTime,
  endTime,
}: CheckInSectionProps) {
  const { t } = useTranslation("common");
  const [checkInCode, setCheckInCode] = useState("");
  const [attendeeId, setAttendeeId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckIn = async () => {
    if (!checkInCode.trim()) {
      toast.error(t("Please enter check-in code"));
      return;
    }

    if (!isLoggedIn && !attendeeId.trim()) {
      toast.error(t("Please enter your attendee ID"));
      return;
    }

    try {
      setSubmitting(true);
      let response;
      if (isLoggedIn) {
        response = await selfCheckIn(eventId, {
          code: checkInCode,
        });
      } else {
        response = await publicSelfCheckIn(eventId, {
          code: checkInCode,
          attendeeId: isLoggedIn ? userAsAttendee?.id || "" : attendeeId,
        });
      }

      console.log("check-in response:", response);

      if (response.status == undefined || response.status / 100 >= 4) {
        const errorMessage = response?.detail || t("Check-in failed");
        toast.error(errorMessage);
      } else {
        toast.success(t("Check-in successful!"));
        setCheckInCode("");
        setAttendeeId("");
      }
    } catch (err: any) {
      const errorMessage =
        err?.message ||
        err?.response?.data?.message ||
        t("Invalid check-in code");
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isCheckInOpen = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    return now >= start && now <= end;
  };

  return (
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
        {!isLoggedIn && (
          <input
            type="text"
            value={attendeeId}
            onChange={(e) => setAttendeeId(e.target.value)}
            placeholder={t("Enter your attendee ID")}
            className="w-full px-5 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono bg-white"
          />
        )}
        <input
          type="text"
          value={checkInCode}
          onChange={(e) => setCheckInCode(e.target.value)}
          placeholder={
            isCheckInOpen()
              ? t("Enter code (e.g., 999999)")
              : t("Check-in is not open")
          }
          disabled={!isCheckInOpen()}
          className="w-full px-5 py-4 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono bg-white"
        />
        <button
          onClick={handleCheckIn}
          disabled={submitting || !isCheckInOpen()}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {submitting ? (
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
  );
}
