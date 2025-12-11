"use client";

import { Card, Tag, Avatar, Button } from "antd";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  registerForTraining,
  getPublicTrainingById,
} from "@/modules/services/trainingService";
import Link from "next/link";
import { USER_TYPE_OPTIONS, USER_TYPES } from "@/constant/data";

interface TrainingRenderProps {
  trainingData?: any;
}

export default function TrainingRender({ trainingData }: TrainingRenderProps) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<string>("");
  const [currentTrainingData, setTrainingData] = useState(trainingData);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!currentTrainingData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        {t("Training not found")}
      </div>
    );
  }

  const {
    title,
    description,
    status,
    location,
    creator,
    mentors = [],
    trainingEvents = [],
    limitRegister,
    currentRegistered,
    id,
    isHost,
    userAsOrganizer,
    userAttendeeStatus,
    registered,
  } = currentTrainingData;

  useEffect(() => {
    const refetchTrainingData = async () => {
      if (typeof window === "undefined" || !currentTrainingData?.id) return;

      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);

      // We refetch data to get the latest user-specific status
      if (!user) return;

      try {
        setIsRefetching(true);
        const freshData = await getPublicTrainingById(currentTrainingData.id);
        console.log("Fresh Training Data:", freshData);
        if (freshData) {
          console.log(freshData);
          setTrainingData(freshData);
        }
      } catch (error) {
        console.error("Error refetching training data:", error);
      } finally {
        setIsRefetching(false);
      }
    };

    refetchTrainingData();
  }, [currentTrainingData?.id, userStatus]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      setUserStatus("guest");
      return;
    }
    const userJson = JSON.parse(user);

    console.log("currentTrainingData:", currentTrainingData);
    console.log("userJson:", userJson);

    const fetchStatus = async () => {
      try {
        if (isHost) setUserStatus("host");
        else if (userAsOrganizer?.roles?.includes("MODIFY"))
          setUserStatus("organizer");
        else if (userAttendeeStatus === "REGISTERED")
          setUserStatus("registered");
        else if (userAttendeeStatus === "PENDING") setUserStatus("pending");
        else if (
          !currentTrainingData.isPublic &&
          (currentTrainingData.allowedType & userJson.type) === 0
        ) {
          setUserStatus("not-allowed");
        } else setUserStatus("none");
      } catch (err) {
        console.error("Error checking user event status:", err);
      }
    };

    fetchStatus();
  }, [id, isHost, userAsOrganizer, userAttendeeStatus]);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await registerForTraining(id);
      toast.success(t("REGISTER_SUCCESS"));
      setUserStatus("pending");
    } catch {
      toast.error(t("REGISTER_FAILED"));
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    try {
      setLoading(true);
      await registerForTraining(id);
      toast.success(t("UNREGISTER_SUCCESS"));
      setUserStatus("registering");
    } catch {
      toast.error(t("UNREGISTER_FAILED"));
    } finally {
      setLoading(false);
    }
  };

  const renderButton = () => {
    const common =
      "font-semibold rounded-full px-6 py-3 transition-all text-white";
    if (new Date(currentTrainingData.location.endTime) < new Date()) {
      return (
        <button disabled className={`${common} bg-gray-400 cursor-not-allowed`}>
          {t("TRAINING ENDED")}
        </button>
      );
    }
    if (currentTrainingData.registered) {
      return (
        <button
          onClick={handleUnregister}
          className={`${common} bg-blue-600 cursor-pointer group hover:bg-red-500 transition-colors duration-300`}
        >
          <span className="group-hover:hidden">{t("REGISTERED")}</span>
          <span className="hidden group-hover:inline">{t("UNREGISTER")}</span>
        </button>
      );
    }
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
      case "not-allowed":
        return (
          <button
            disabled
            className={`${common} bg-red-500 cursor-not-allowed`}
          >
            {t("NOT ALLOWED TO JOIN")}
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

  const trainingUserTypes = useMemo(() => {
    if (currentTrainingData.isPublic) {
      return t("All Users");
    }
    const types: string[] = [];
    for (const userTypeOption in USER_TYPE_OPTIONS) {
      if (
        currentTrainingData.allowedType &
        USER_TYPE_OPTIONS[userTypeOption].value
      ) {
        types.push(t(USER_TYPE_OPTIONS[userTypeOption].label));
      }
    }
    return types.join(", ");
  }, [currentTrainingData.isPublic, currentTrainingData.allowedType, t]);

  return (
    <div className="min-h-screen bg-[#f4faf4] py-12 px-4 md:px-8 lg:px-12">
      <div className="w-full mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-3xl p-8 mb-10 shadow-md text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">{title}</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Card className="rounded-2xl shadow-md mb-10 p-6 w-full md:w-3/4">
            <div className="flex flex-col md:flex-row md:justify-between mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full md:w-2/3">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <p>{location?.destination || t("No location info")}</p>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p>
                    {t("Start")}:{" "}
                    {new Date(location?.startTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Users className="w-5 h-5 text-blue-600" />
                  <p>
                    {t("Registered")}: {currentRegistered}/{limitRegister}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <p>
                    {t("End")}:{" "}
                    {new Date(location?.endTime).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <p>
                    {t("User Type")}: {trainingUserTypes}
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex flex-col items-start md:items-center gap-3">
                {renderButton()}
              </div>
            </div>

            <div
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: description || "" }}
            />
          </Card>

          {mentors.length > 0 && (
            <Card className="rounded-2xl shadow-sm mb-10 p-6 w-full !bg-yellow-100 md:w-1/4">
              <h2 className="text-2xl font-bold mb-4">{t("Mentors")}</h2>
              <div className="flex flex-wrap gap-4">
                {mentors.map((m: any) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <Avatar src={m.userUrl} alt={m.fullName} />
                    <p className="font-medium">{m.fullName}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {trainingEvents.length > 0 && (
          <Card className="rounded-2xl shadow-sm p-6 !bg-green-200 !my-8">
            <h2 className="text-2xl font-bold mb-4">{t("Lessons")}</h2>
            <div className="space-y-4">
              {trainingEvents.map((e: any) => (
                <Link
                  className="!text-black"
                  href={`/events/${e.id}`}
                  key={e.id}
                >
                  <div
                    key={e.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all"
                  >
                    <h3 className="text-lg font-semibold mb-1">{e.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {e.description?.slice(0, 120)}...
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      {new Date(e.location.startTime).toLocaleString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
