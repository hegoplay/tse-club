"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, X, Calendar, ArrowUpDown } from "lucide-react";
import EventSection from "@/components/EventSection";
import TrainingSection from "@/components/TrainingSection";
import { useTranslation } from "react-i18next";
import { EventSearchRequestDto, RangeTimeType, TrainingSearchRequestDto } from "@/constant/types";
import { EventAndTrainingFilter } from "@/components/events/filters/EventAndTrainingFilter";

export default function EventPage() {
  const { t } = useTranslation("common");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"events" | "trainings">("events");

  // Event filters
  const [eventSearchParams, setEventSearchParams] =
    useState<EventSearchRequestDto>({});

  // Training filters
  const [trainingSearchParams, setTrainingSearchParams] =
    useState<TrainingSearchRequestDto>({
      searchs: ["title"],
      searchValues: [""],
    });

    

  return (
    <div className="min-h-screen pb-20 mx-auto max-w-full md:max-w-11/12"
    >
      {/* Container chính cho bố cục 2 cột trên PC/iPad, 1 cột trên Mobile */}
      <div className="flex flex-col-reverse lg:flex-row px-4 md:px-6 gap-8">
        <div className="md:flex-1 mt-8">
          {/* Content Sections */}
          {activeTab === "events" ? (
            <>
              <EventSection
                pageSize={9}
                eventSearchParams={{
                  ...eventSearchParams,
                  rangeTimeType: RangeTimeType.ONGOING,
                }}
                title={t("Ongoing events")}
                
              />
              <EventSection
                pageSize={9}
                eventSearchParams={{
                  ...eventSearchParams,
                  rangeTimeType: RangeTimeType.UPCOMING,
                }}
                title={t("Upcoming events")}
              />

              <EventSection
                pageSize={9}
                eventSearchParams={{
                  ...eventSearchParams,
                  rangeTimeType: RangeTimeType.PAST,
                }}
                title={t("Past events")}
              />
            </>
          ) : (
            <>
              <TrainingSection
                pageSize={9}
                rangeTimeType= {RangeTimeType.UPCOMING}
                title={t("Upcoming trainings")}
                trainingSearchParams={trainingSearchParams}
              />
              <TrainingSection
                pageSize={9}
                rangeTimeType={RangeTimeType.ONGOING}
                title={t("Ongoing trainings")}
                trainingSearchParams={trainingSearchParams}
              />
              <TrainingSection
                pageSize={9}
                rangeTimeType={RangeTimeType.PAST}
                title={t("Past trainings")}
                trainingSearchParams={trainingSearchParams}
              />
            </>
          )}
        </div>
        <div className="w-full lg:w-96 lg:order-2 lg:sticky lg:top-6 self-start">
          <EventAndTrainingFilter
            eventSearchParams={eventSearchParams}
            setEventSearchParams={setEventSearchParams}
            trainingSearchParams={trainingSearchParams}
            setTrainingSearchParams={setTrainingSearchParams}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
