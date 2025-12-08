"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Calendar, ArrowUpDown } from "lucide-react";
import EventSection from "@/components/EventSection";
import TrainingSection from "@/components/TrainingSection";

export default function EventPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("events");

  const [eventKeyword, setEventKeyword] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventSort, setEventSort] = useState("location.startTime,asc");
  const [trainingKeyword, setTrainingKeyword] = useState("");
  const [trainingStatus, setTrainingStatus] = useState("");
  const [trainingStartDate, setTrainingStartDate] = useState("");
  const [trainingEndDate, setTrainingEndDate] = useState("");
  const [trainingSort, setTrainingSort] = useState("location.startTime,asc");

  const eventCategories = [
    "Workshop",
    "Seminar",
    "Competition",
    "Social",
    "Tech Talk",
  ];
  const eventTypes = ["SEMINAR", "WORKSHOP", "COMPETITION"];
  const trainingStatuses = ["ACCEPTED", "PENDING", "REJECTED"];

  const sortOptions = [
    { label: "Title (A-Z)", value: "title,asc" },
    { label: "Title (Z-A)", value: "title,desc" },
    { label: "Start Time (Oldest)", value: "location.startTime,asc" },
    { label: "Start Time (Newest)", value: "location.startTime,desc" },
    { label: "Created Date (Oldest)", value: "createdAt,asc" },
    { label: "Created Date (Newest)", value: "createdAt,desc" },
    { label: "Last Modified Time (Oldest)", value: "lastModifiedTime,asc" },
    { label: "Last Modified Time (Newest)", value: "lastModifiedTime,desc" },
    { label: "Registration (Low to High)", value: "currentRegistered,asc" },
    { label: "Registration (High to Low)", value: "currentRegistered,desc" },
  ];

  const clearEventFilters = () => {
    setEventKeyword("");
    setEventCategory("");
    setEventType("");
    setEventStartDate("");
    setEventEndDate("");
    setEventSort("location.startTime,asc");
  };

  const clearTrainingFilters = () => {
    setTrainingKeyword("");
    setTrainingStatus("");
    setTrainingStartDate("");
    setTrainingEndDate("");
    setTrainingSort("location.startTime,asc");
  };

  const formatDateForDisplay = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white py-16 px-4 mx-4 md:mx-6 mt-6 rounded-3xl text-center relative overflow-hidden shadow-2xl"
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-4"
          >
            Explore Events & Trainings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl mt-4 opacity-90 px-2 md:px-0"
          >
            Stay updated with our club's latest happenings and workshops
          </motion.p>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 md:px-6 mt-8"
      >
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Tab Selection */}
          <div className="flex gap-4 mb-6 border-b pb-4">
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "events"
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("trainings")}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "trainings"
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Trainings
            </button>
          </div>

          {/* Filter Toggle Button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Filter size={20} />
              Filter & Sort {activeTab === "events" ? "Events" : "Trainings"}
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              {showFilters ? (
                <>
                  <X size={18} />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter size={18} />
                  Show Filters
                </>
              )}
            </button>
          </div>

          {/* Event Filters */}
          {showFilters && activeTab === "events" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Search by keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Events
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by title, description..."
                    value={eventKeyword}
                    onChange={(e) => setEventKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">All Categories</option>
                    {eventCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Type filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">All Types</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Range Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Sort By
                </label>
                <select
                  value={eventSort}
                  onChange={(e) => setEventSort(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={clearEventFilters}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Training Filters */}
          {showFilters && activeTab === "trainings" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Search by keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Trainings
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by title, instructor..."
                    value={trainingKeyword}
                    onChange={(e) => setTrainingKeyword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={trainingStatus}
                  onChange={(e) => setTrainingStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">All Statuses</option>
                  {trainingStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Date Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={trainingStartDate}
                      onChange={(e) => setTrainingStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={trainingEndDate}
                      onChange={(e) => setTrainingEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Sort By
                </label>
                <select
                  value={trainingSort}
                  onChange={(e) => setTrainingSort(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear button */}
              <div className="flex justify-end pt-4 border-t">
                <button
                  onClick={clearTrainingFilters}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}

          {/* Active Filters Display */}
          {((activeTab === "events" &&
            (eventKeyword ||
              eventCategory ||
              eventType ||
              eventStartDate ||
              eventEndDate)) ||
            (activeTab === "trainings" &&
              (trainingKeyword ||
                trainingStatus ||
                trainingStartDate ||
                trainingEndDate))) && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Active Filters:
              </p>
              <div className="flex flex-wrap gap-2">
                {activeTab === "events" && eventKeyword && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    Search: {eventKeyword}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => setEventKeyword("")}
                    />
                  </span>
                )}
                {activeTab === "events" && eventCategory && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    Category: {eventCategory}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => setEventCategory("")}
                    />
                  </span>
                )}
                {activeTab === "events" && eventType && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    Type: {eventType}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => setEventType("")}
                    />
                  </span>
                )}
                {activeTab === "events" && eventStartDate && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    From: {formatDateForDisplay(eventStartDate)}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => setEventStartDate("")}
                    />
                  </span>
                )}
                {activeTab === "events" && eventEndDate && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    To: {formatDateForDisplay(eventEndDate)}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-blue-900"
                      onClick={() => setEventEndDate("")}
                    />
                  </span>
                )}
                {activeTab === "trainings" && trainingKeyword && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    Search: {trainingKeyword}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-indigo-900"
                      onClick={() => setTrainingKeyword("")}
                    />
                  </span>
                )}
                {activeTab === "trainings" && trainingStatus && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    Status: {trainingStatus}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-indigo-900"
                      onClick={() => setTrainingStatus("")}
                    />
                  </span>
                )}
                {activeTab === "trainings" && trainingStartDate && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    From: {formatDateForDisplay(trainingStartDate)}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-indigo-900"
                      onClick={() => setTrainingStartDate("")}
                    />
                  </span>
                )}
                {activeTab === "trainings" && trainingEndDate && (
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
                    To: {formatDateForDisplay(trainingEndDate)}
                    <X
                      size={14}
                      className="cursor-pointer hover:text-indigo-900"
                      onClick={() => setTrainingEndDate("")}
                    />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Content Sections */}
      {activeTab === "events" ? (
        <>
          <EventSection
            pageSize={9}
            rangeTimeType="UPCOMING"
            title="Upcoming Events"
            keyword={eventKeyword}
            category={eventCategory}
            startTime={eventStartDate}
            endTime={eventEndDate}
            sort={eventSort}
          />
          <EventSection
            pageSize={9}
            rangeTimeType="ONGOING"
            title="Ongoing Events"
            keyword={eventKeyword}
            category={eventCategory}
            startTime={eventStartDate}
            endTime={eventEndDate}
            sort={eventSort}
          />
          <EventSection
            pageSize={9}
            rangeTimeType="PAST"
            title="Past Events"
            keyword={eventKeyword}
            category={eventCategory}
            startTime={eventStartDate}
            endTime={eventEndDate}
            sort={eventSort}
          />
        </>
      ) : (
        <>
          <TrainingSection
            pageSize={9}
            rangeTimeType="UPCOMING"
            title="Upcoming Trainings"
            keyword={trainingKeyword}
            status={trainingStatus}
            startTime={trainingStartDate}
            endTime={trainingEndDate}
            sort={trainingSort}
          />
          <TrainingSection
            pageSize={9}
            rangeTimeType="ONGOING"
            title="Ongoing Trainings"
            keyword={trainingKeyword}
            status={trainingStatus}
            startTime={trainingStartDate}
            endTime={trainingEndDate}
            sort={trainingSort}
          />
          <TrainingSection
            pageSize={9}
            rangeTimeType="PAST"
            title="Past Trainings"
            keyword={trainingKeyword}
            status={trainingStatus}
            startTime={trainingStartDate}
            endTime={trainingEndDate}
            sort={trainingSort}
          />
        </>
      )}
    </div>
  );
}
