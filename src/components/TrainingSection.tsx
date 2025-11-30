"use client";

import { useEffect, useState } from "react";
import { Image, Spin } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPublicTraining } from "@/modules/services/trainingService";
import { Images } from "@/constant/image";
import dayjs from "dayjs";

interface Training {
  id: string;
  title: string;
  location: {
    destination: string;
    startTime: string;
    endTime: string;
  };
  status: string;
  creator: {
    fullName: string;
  };
  limitRegister: number;
  currentRegistered: number;
}


interface TrainingSectionProps {
  pageSize?: number;
  seeAll?: boolean;
  rangeTimeType?: "UPCOMING" | "ONGOING" | "PAST"; //UPCOMING, ONGOING, PAST
  title: string;
}

export default function TrainingSection({
  pageSize,
  seeAll,
  rangeTimeType,
  title,
}: TrainingSectionProps) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

  useEffect(() => {
    async function fetchTrainings() {
      try {
        const res = await getPublicTraining({
          size: pageSize,
          rangeTimeType: rangeTimeType,
        });
        setTrainings(res || []);
      } catch (error) {
        console.error("Failed to fetch public trainings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrainings();
  }, [pageSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="py-16 px-4 md:px-6 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-2xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-12"
      >
        {t(
          "Learn about running a successful and sustainable club, teaching programming, and much more with our free online courses."
        )}
      </motion.p>

      {trainings.length === 0 ? (
        <p className="text-gray-500 text-base">{t("No trainings available")}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full mx-auto">
          {trainings.map((training, index) => (
            <motion.div
              key={training.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${
                ["bg-yellow-100", "bg-blue-100", "bg-rose-100"][index % 3]
              } rounded-3xl p-6 md:p-8 text-left shadow-md hover:shadow-lg transition-all duration-300`}
            >
              <Image src={Images.javaCourse.src} />
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                {training.title}
              </h3>

              <p className="text-sm md:text-base font-medium text-gray-700 mb-2">
                📍 {training.location?.destination || t("No location")}
              </p>

              <p className="text-sm text-gray-600 mb-1">
                🕒 {t("From")}:{" "}
                {new Date(training.location?.startTime).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                ⏰ {t("To")}:{" "}
                {new Date(training.location?.endTime).toLocaleDateString()}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                👤 {t("Instructor")}: {training.creator?.fullName || "—"}
              </p>

              <p className="text-sm text-gray-700 mb-2">
                🎯 {t("Registered")}: {training.currentRegistered || 0}/
                {training.limitRegister}
              </p>

              <p
                className={`text-sm font-semibold mb-3 ${
                  training.status === "ACCEPTED"
                    ? "text-green-600"
                    : training.status === "PENDING"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }`}
              >
                {t("Status")}: {t(training.status)}
              </p>

              <Link href={`/training/${training.id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 bg-blue-500 text-white font-semibold px-5 py-2 rounded-full transition-all duration-300 ease-in-out hover:bg-indigo-600"
                >
                  {t("View details")}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && trainings.length > 0 && seeAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link href="/training">
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-500 text-white rounded-full px-8 py-3 font-semibold transition-all duration-300 ease-in-out hover:bg-indigo-600"
            >
              {t("See all trainings")}
            </motion.button>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
