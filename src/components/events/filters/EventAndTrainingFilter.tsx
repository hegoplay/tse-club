import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, Filter, X, Calendar, ArrowUpDown } from "lucide-react";
import {
  EventSearchRequestDto,
  EventType,
  RangeTimeType,
  TrainingSearchRequestDto,
} from "@/constant/types";

interface EventFilterProps {
  children?: ReactNode;
  eventSearchParams: EventSearchRequestDto;
  setEventSearchParams: (params: EventSearchRequestDto) => void;
  // training filters can be added here later
  trainingSearchParams: TrainingSearchRequestDto;
  setTrainingSearchParams: (params: TrainingSearchRequestDto) => void;
  setActiveTab: (tab: "events" | "trainings") => void;
  activeTab: "events" | "trainings";
}

export const EventAndTrainingFilter: React.FC<EventFilterProps> = (props) => {
  const { t } = useTranslation("common");

  const sortOptions = [
    { label: t("Title (A-Z)"), value: "title,asc" },
    { label: t("Title (Z-A)"), value: "title,desc" },
    { label: t("Start Time (Oldest)"), value: "location.startTime,asc" },
    { label: t("Start Time (Newest)"), value: "location.startTime,desc" },
    { label: t("Created Date (Oldest)"), value: "createdAt,asc" },
    { label: t("Created Date (Newest)"), value: "createdAt,desc" },
    { label: t("Last Modified Time (Oldest)"), value: "lastModifiedTime,asc" },
    { label: t("Last Modified Time (Newest)"), value: "lastModifiedTime,desc" },
    { label: t("Registration (Low to High)"), value: "currentRegistered,asc" },
    { label: t("Registration (High to Low)"), value: "currentRegistered,desc" },
  ];

  const clearEventFilters = () => {
    props.setEventSearchParams({
      ...props.eventSearchParams,
      keyword: "",
      endTime: undefined,
      startTime: undefined,
      eventType: undefined,
      sort: "location.startTime,asc",
    });
  };

  const clearTrainingFilters = () => {
    props.setTrainingSearchParams({
      ...props.trainingSearchParams,
      endTime: undefined,
      startTime: undefined,
      sort: "location.startTime,asc",
      searchs: ["title"],
      searchValues: ["**"],
    });
  };

  const renderTabSection = () => {
    return (
      <div className="flex gap-4 mb-6 border-b pb-4">
        <button
          onClick={() => {  props.setActiveTab("events")}}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            props.activeTab === "events"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("Events")}
        </button>
        <button
          onClick={() => {  props.setActiveTab("trainings")}}
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
            props.activeTab === "trainings"
              ? "bg-indigo-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {t("Trainings")}
        </button>
      </div>
    );
  };

  const renderToggleButton = () => {
    return (
      <div className="flex justify-between items-center mb-4 ">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Filter size={20} />
          {t("Filter & Sort")}{" "}
          {props.activeTab === "events" ? t("Events") : t("Trainings")}
        </h3>
      </div>
    );
  };

  const EventFilter = () => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-6"
      >
        {/* Search by keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Search Events")}
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("Search by title, description...")}
              value={props.eventSearchParams.keyword || ""}
              onChange={(e) =>
                props.setEventSearchParams({
                  ...props.eventSearchParams,
                  keyword: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Event Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Event Type")}
            </label>
            <select
              value={props.eventSearchParams.eventType}
              onChange={(e) =>
                props.setEventSearchParams({
                  ...props.eventSearchParams,
                  eventType: e.target.value as EventType,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {Object.values(EventType).map((type) => (
                <option key={type} value={type}>
                  {t(type)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Range Picker */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar size={16} />
            {t("Date Range")}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t("Start Date")}
              </label>
              <input
                type="date"
                value={props.eventSearchParams.startTime || ""}
                onChange={(e) =>
                  props.setEventSearchParams({
                    ...props.eventSearchParams,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t("End Date")}
              </label>
              <input
                type="date"
                value={props.eventSearchParams.endTime || ""}
                onChange={(e) =>
                  props.setEventSearchParams({
                    ...props.eventSearchParams,
                    endTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <ArrowUpDown size={16} />
            {t("Sort By")}
          </label>
          <select
            value={props.eventSearchParams.sort}
            onChange={(e) =>
              props.setEventSearchParams({
                ...props.eventSearchParams,
                sort: e.target.value,
              })
            }
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
            {t("Clear All Filters")}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="max-w-7xl mx-auto px-0 md:px-4 mt-3 md:mt-20 mb-0 md:mb-10 w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
        {/* Tab Selection */}
        {renderTabSection()}

        {/* Filter Toggle Button */}
        {renderToggleButton()}

        {/* Event Filters */}
        {props.activeTab === "events" && <EventFilter />}
        {/* Training Filters */}
        {props.activeTab === "trainings" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            {/* Search by keyword */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Search Trainings")}
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder={t("Search by title, instructor...")}
                  value={props.trainingSearchParams.searchValues?.[0] || ""}
                  onChange={(e) => props.setTrainingSearchParams({
                    ...props.trainingSearchParams,
                    searchValues: [e.target.value],
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Date Range Picker */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                {t("Date Range")}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {t("Start Date")}
                  </label>
                  <input
                    type="date"
                    value={props.trainingSearchParams.startTime || ""}
                    onChange={(e) => props.setTrainingSearchParams({
                      ...props.trainingSearchParams,
                      startTime: e.target.value,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    {t("End Date")}
                  </label>
                  <input
                    type="date"
                    value={props.trainingSearchParams.endTime || ""}
                    onChange={(e) => props.setTrainingSearchParams({
                      ...props.trainingSearchParams,
                      endTime: e.target.value,
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ArrowUpDown size={16} />
                {t("Sort By")}
              </label>
              <select
                value={props.trainingSearchParams.sort || "location.startTime,asc"}
                onChange={(e) => props.setTrainingSearchParams({
                  ...props.trainingSearchParams,
                  sort: e.target.value,
                })}
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
                {t("Clear All Filters")}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

//  {/* Event Filters */}
//               {showFilters && activeTab === "events" && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="space-y-6"
//                 >
//                   {/* Search by keyword */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("Search Events")}
//                     </label>
//                     <div className="relative">
//                       <Search
//                         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                         size={20}
//                       />
//                       <input
//                         type="text"
//                         placeholder={t("Search by title, description...")}
//                         value={eventKeyword}
//                         onChange={(e) => setEventKeyword(e.target.value)}
//                         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {/* Category filter */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         {t("Category")}
//                       </label>
//                       <select
//                         value={eventCategory}
//                         onChange={(e) => setEventCategory(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                       >
//                         <option value="">{t("All Categories")}</option>
//                         {eventCategories.map((cat) => (
//                           <option key={cat} value={cat}>
//                             {cat}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     {/* Event Type filter */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         {t("Event Type")}
//                       </label>
//                       <select
//                         value={eventType}
//                         onChange={(e) => setEventType(e.target.value)}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                       >
//                         <option value="">{t("All Types")}</option>
//                         {eventTypes.map((type) => (
//                           <option key={type} value={type}>
//                             {type}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {/* Date Range Picker */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <Calendar size={16} />
//                       {t("Date Range")}
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1">
//                           {t("Start Date")}
//                         </label>
//                         <input
//                           type="date"
//                           value={eventStartDate}
//                           onChange={(e) => setEventStartDate(e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-500 mb-1">
//                           {t("End Date")}
//                         </label>
//                         <input
//                           type="date"
//                           value={eventEndDate}
//                           onChange={(e) => setEventEndDate(e.target.value)}
//                           className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Sort Options */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <ArrowUpDown size={16} />
//                       {t("Sort By")}
//                     </label>
//                     <select
//                       value={eventSort}
//                       onChange={(e) => setEventSort(e.target.value)}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
//                     >
//                       {sortOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Clear button */}
//                   <div className="flex justify-end pt-4 border-t">
//                     <button
//                       onClick={clearEventFilters}
//                       className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
//                     >
//                       {t("Clear All Filters")}
//                     </button>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Training Filters */}

//               {/* Active Filters Display */}
//               {((activeTab === "events" &&
//                 (eventKeyword ||
//                   eventCategory ||
//                   eventType ||
//                   eventStartDate ||
//                   eventEndDate)) ||
//                 (activeTab === "trainings" &&
//                   (trainingKeyword ||
//                     trainingStatus ||
//                     trainingStartDate ||
//                     trainingEndDate))) && (
//                 <div className="mt-4 pt-4 border-t">
//                   <p className="text-sm font-medium text-gray-700 mb-3">
//                     {t("Active Filters")}:
//                   </p>
//                   <div className="flex flex-wrap gap-2">
//                     {activeTab === "events" && eventKeyword && (
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("Search")}: {eventKeyword}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-blue-900"
//                           onClick={() => setEventKeyword("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "events" && eventCategory && (
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("Category")}: {eventCategory}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-blue-900"
//                           onClick={() => setEventCategory("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "events" && eventType && (
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("Type")}: {eventType}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-blue-900"
//                           onClick={() => setEventType("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "events" && eventStartDate && (
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("From")}: {formatDateForDisplay(eventStartDate)}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-blue-900"
//                           onClick={() => setEventStartDate("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "events" && eventEndDate && (
//                       <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("To")}: {formatDateForDisplay(eventEndDate)}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-blue-900"
//                           onClick={() => setEventEndDate("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "trainings" && trainingKeyword && (
//                       <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("Search")}: {trainingKeyword}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-indigo-900"
//                           onClick={() => setTrainingKeyword("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "trainings" && trainingStatus && (
//                       <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("Status")}: {t(trainingStatus)}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-indigo-900"
//                           onClick={() => setTrainingStatus("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "trainings" && trainingStartDate && (
//                       <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("From")}: {formatDateForDisplay(trainingStartDate)}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-indigo-900"
//                           onClick={() => setTrainingStartDate("")}
//                         />
//                       </span>
//                     )}
//                     {activeTab === "trainings" && trainingEndDate && (
//                       <span className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 font-medium">
//                         {t("To")}: {formatDateForDisplay(trainingEndDate)}
//                         <X
//                           size={14}
//                           className="cursor-pointer hover:text-indigo-900"
//                           onClick={() => setTrainingEndDate("")}
//                         />
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               )}
