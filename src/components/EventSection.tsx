"use client";

import { useEffect, useState } from "react";
import { getPublicEvents } from "@/modules/services/eventService";
import { Event } from "@/constant/types";
import { Spin } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

interface EventSectionProps {
  pageSize?: number;
  seeAll?: boolean;
}

export default function EventSection({ pageSize, seeAll }: EventSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("common");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getPublicEvents({
          size: pageSize,
          startTime: dayjs().toISOString(),
        });
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch public events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
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
        className="text-2xl md:text-4xl font-bold text-gray-900 mb-12"
      >
        {t("Events and Training")}
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full mx-auto">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`${
              ["bg-pink-100", "bg-green-100", "bg-sky-100"][index % 3]
            } rounded-3xl p-6 md:p-8 text-left shadow-md hover:shadow-lg transition-all duration-300`}
          >
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              {event.title}
            </h3>
            <p className="font-semibold text-sm md:text-base mb-3">
              {event.category
                ? `${t("Category")}: ${event.category}`
                : t("Upcoming event")}
            </p>

            <p>
              {t("Số lượng đăng ký: ")} {event.currentRegistered} /{" "}
              {event.limitRegister}
            </p>

            <div
              dangerouslySetInnerHTML={{
                __html: event.description || "",
              }}
              className="text-sm md:text-base line-clamp-3 my-2"
            />

            <Link href={`/events/${event.id}`}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                transition={{ duration: 0.3 }}
                className="mt-3 bg-blue-500 text-white font-semibold px-5 py-2 rounded-full transition-all duration-500 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500"
              >
                {t("View details")}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      {!loading && events.length > 0 && seeAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Link href="/events">
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              transition={{ duration: 0.3 }}
              className="bg-blue-500 text-white rounded-full px-8 py-3 font-semibold transition-all duration-500 ease-in-out hover:bg-gradient-to-r hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500"
            >
              {t("See all events")}
            </motion.button>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
