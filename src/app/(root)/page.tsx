"use client";

import EventSection from "@/components/EventSection";
import LatestPost from "@/components/LatestPost";
import { Images } from "@/constant/image";
import { Image } from "antd";
import { Code, Heart, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("common");

  return (
    <section className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
      {/* HERO SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Left */}
        <div className="bg-[#36b24a] rounded-2xl p-6 sm:p-10 lg:p-16 flex flex-col justify-center text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black mb-3 sm:mb-4">
              {t("We are TSE Club")}
            </h2>
            <p className="text-base sm:text-lg text-black/80 mb-5 sm:mb-6">
              {t(
                "Learn to code, shape the future. Join a global community of digital creators."
              )}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4">
              <button className="bg-black text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:opacity-80 transition-transform hover:scale-105 text-sm sm:text-base">
                {t("About Us")}
              </button>
              <button className="border-2 border-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-black hover:text-white transition-transform hover:scale-105 text-sm sm:text-base">
                {t("Join Us")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative h-52 sm:h-64 md:h-[480px] lg:h-[560px] rounded-2xl overflow-hidden"
        >
          <Image
            src={Images.iuhStudent.src}
            alt="TSE members"
            className="object-cover w-full !h-full"
            preview={false}
          />
        </motion.div>
      </div>

      {/* STATISTIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[
          {
            bg: "#5b4c97",
            title: "200+",
            text: "young student involved in TSE over 10 years",
            icon: "</>",
            textColor: "white",
          },
          {
            bg: "#fcd9cf",
            title: "20+ prizes",
            text: "in national and international competitions",
            icon: "🌍",
            textColor: "black",
          },
          {
            bg: "#36b8e9",
            title: "90%",
            text: "of young people increase their skills and independence in coding",
            icon: "📈",
            textColor: "black",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
            style={{ backgroundColor: item.bg }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h3
              className={`text-xl sm:text-2xl font-bold mb-2 text-${item.textColor}`}
            >
              {t(item.title)}
            </h3>
            <p className={`text-sm sm:text-base text-${item.textColor}`}>
              {t(item.text)}
            </p>
            <div className={`mt-3 text-4xl sm:text-5xl text-${item.textColor}`}>
              {item.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* JOIN COMMUNITY SECTION */}
      <div className="flex flex-col items-center text-center mt-16 sm:mt-20 mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          {t("Join the TSE Club community")}
        </h2>
        <p className="text-gray-700 max-w-2xl sm:max-w-3xl mx-auto mb-10 sm:mb-12 text-sm sm:text-base">
          {t(
            "TSE Clubs are free and open to all school-aged young people. Find out how to join a club, start a club of your own, or volunteer at a club in your community."
          )}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {[
            {
              icon: (
                <Search
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3b9cff] w-12 h-12"
                  strokeWidth={2.5}
                />
              ),
              title: "Join a club",
              text: "Learn to code, develop your skills, and have fun. Join your local community of young creators.",
              btn: "Join a TSE Club",
              color: "#a2d8ff",
            },
            {
              icon: (
                <Code
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#4cc16c] w-12 h-12"
                  strokeWidth={2.5}
                />
              ),
              title: "Run a club",
              text: "Inspire young people in your community. You don’t need any coding experience to run a TSE Club.",
              btn: "Run a TSE Club",
              color: "#baf4c2",
            },
            {
              icon: (
                <Heart
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#eb5b93] w-12 h-12"
                  strokeWidth={2.5}
                />
              ),
              title: "Volunteer at a club",
              text: "Learn new skills and support the next generation of digital creators. Get involved with your local club.",
              btn: "Volunteer at a TSE Club",
              color: "#f9c7d9",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-5 sm:mb-6">
                <span
                  className="text-5xl sm:text-6xl font-bold"
                  style={{ color: card.color }}
                >
                  {"{"}
                </span>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12">
                  {card.icon}
                </div>
                <span
                  className="text-5xl sm:text-6xl font-bold"
                  style={{ color: card.color }}
                >
                  {"}"}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {t(card.title)}
              </h3>
              <p className="text-gray-700 mb-6 max-w-xs text-sm sm:text-base">
                {t(card.text)}
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-black text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 font-semibold hover:opacity-80 transition-transform text-sm sm:text-base"
              >
                {t(card.btn)}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <LatestPost />

      {/* FIT IUH SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="bg-[#FFF7AD] rounded-3xl p-6 sm:p-8 md:p-12 my-8 flex flex-col md:flex-row items-center gap-8 md:gap-10 text-center md:text-left"
      >
        <div className="md:w-1/2 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug">
            {t("TSE Club is a club affiliated with IUH")}
          </h2>
          <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
            {t(
              "TSE Club is a project run by the Faculty of Information Technology, a faculty of IUH with the mission of finding and training talented young people with a passion for coding."
            )}
          </p>
          <a
            href="https://fit.iuh.edu.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base hover:opacity-80 transition-transform hover:scale-105"
          >
            {t("FIT IUH")}
          </a>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full aspect-[5/3] rounded-2xl overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/Hd1p0l1ZGqs"
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </motion.section>

      <EventSection pageSize={3} seeAll={true} />
    </section>
  );
}
