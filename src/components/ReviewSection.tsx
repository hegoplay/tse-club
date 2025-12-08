"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { addReview } from "@/modules/services/eventService";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AttendeeDto, AttendeeStatus, UserShortInfoResponseDto } from "@/constant/types";

interface ReviewSectionProps {
  eventId: string;
  category: string;
  userAsAttendee?: AttendeeDto | null;
}

export default function ReviewSection({
  eventId,
  category,
  userAsAttendee,
}: ReviewSectionProps) {
  const { t } = useTranslation("common");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      toast.error(t("Please enter your review"));
      return;
    }
    try {
      setSubmitting(true);
      await addReview(eventId, review);
      toast.success(t("Review submitted successfully!"));
      setReview("");
    } catch (err: any) {
      toast.error(err?.message || t("Failed to submit review"));
    } finally {
      setSubmitting(false);
    }
  };

  const ableToReview =
    userAsAttendee && userAsAttendee.status === AttendeeStatus.CHECKED;

  console.log("userAsAttendee", userAsAttendee);

  if (category !== "SEMINAR") return null;

  return (
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
          <p className="text-sm text-amber-700">{t("Share your experience")}</p>
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
          disabled={submitting || !ableToReview}
        />
        <button
          onClick={handleSubmitReview}
          disabled={submitting || !ableToReview}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
              {t("SUBMITTING") || "Submitting..."}
            </span>
          ) : (
            t("Submit Review")
          )}
        </button>
      </div>
    </motion.div>
  );
}
