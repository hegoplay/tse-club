"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import EventSection from "@/components/EventSection";
import TrainingSection from "@/components/TrainingSection";

export default function EventPage() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-[#f4faf4] pb-20">
      {/* 🎯 Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-br from-blue-400 via-blue-800 to-indigo-700 text-white py-12 px-4 mx-4 md:mx-6 rounded-3xl text-center relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold leading-tight"
          >
            {t("Explore Our Latest Events & Trainings")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base md:text-lg mt-4 opacity-90 px-2 md:px-0"
          >
            {t("Stay updated with our club’s latest happenings and workshops.")}
          </motion.p>
        </div>

        {/* Hiệu ứng nền */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.25),_transparent_70%)]"
        />
      </motion.div>

      <EventSection pageSize={9} />
      <TrainingSection pageSize={9} />
    </div>
  );
}
