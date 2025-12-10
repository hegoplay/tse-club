"use client";

import { useEffect, useState } from "react";
import { Breakpoint, Image, Spin, Table, TablePaginationConfig } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getPublicTraining } from "@/modules/services/trainingService";
import { Images } from "@/constant/image";
import dayjs from "dayjs";
import { PageWrapperDto, RangeTimeType, TrainingSearchRequestDto, UserShortInfoResponseDto } from "@/constant/types";
import { formatDate } from "@/lib/utils";

interface Training {
  id: string;
  title: string;
  location: {
    destination: string;
    startTime: string;
    endTime: string;
  };
  status: string;
  creator: UserShortInfoResponseDto;
  limitRegister: number;
  currentRegistered: number;
  featuredImageUrl?: string;
  deleted: boolean;
  createdAt: string;
  lastModifiedAt: string;
  isPublic: boolean;
}

interface TrainingSectionProps {
  pageSize?: number;
  trainingSearchParams: TrainingSearchRequestDto
  rangeTimeType?: RangeTimeType;
  title: string;
}


export default function TrainingSection({
  pageSize = 10,
  title,
  rangeTimeType,
  trainingSearchParams,
}: TrainingSectionProps) {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Bắt đầu từ trang 0 (API thường dùng)
  const [totalTrainings, setTotalTrainings] = useState(0); // Tổng số đào tạo

  const { t } = useTranslation("common");

  const fetchTraining = async (page: number, size: number) => {
      setLoading(true);
      try {
        const customedSearchValues = trainingSearchParams.searchValues?.map((value) =>
          "*" + value.trim() + "*"
        );
        const data: PageWrapperDto = await getPublicTraining({
          // Gửi thông tin phân trang lên API
          page: page,
          size: size,
  
          rangeTimeType: trainingSearchParams.rangeTimeType,
          sort: trainingSearchParams.sort || "location.startTime,asc",
          startTime: trainingSearchParams.startTime,
          endTime: trainingSearchParams.endTime,
          searchs: trainingSearchParams.searchs,
          searchValues: customedSearchValues,
        });
  
        setTrainings(data._embedded ? data._embedded.trainingWrapperDtoList : []); // Cập nhật dữ liệu đào tạo
        console.log(data._embedded.trainingWrapperDtoList)
        setTotalTrainings(data.page.totalElements); // Cập nhật tổng số lượng
        setCurrentPage(data.page.number); // Đảm bảo trang hiện tại được đồng bộ với API (thường là number)
      } catch (error) {
        console.error("Failed to fetch public trainings:", error);
        setTrainings([]); // Xóa dữ liệu nếu có lỗi
        setTotalTrainings(0);
      } finally {
        setLoading(false);
      }
    }

  useEffect(() => {
    setLoading(true); 

    const handler = setTimeout(() => {
      fetchTraining(0, pageSize);
    }, 500); // Độ trễ 500ms
    
    return () => {
      clearTimeout(handler);
    };
  }, [pageSize, trainingSearchParams]);

  // Hàm xử lý khi người dùng thay đổi trang
  const handleTableChange = (pagination: TablePaginationConfig) => {
    // Ant Design pagination.current là 1-indexed, API thường là 0-indexed.
    const newPage = pagination.current! - 1;

    // Kiểm tra xem pageSize có thay đổi không, mặc dù thường không thay đổi ở đây
    const newPageSize = pagination.pageSize || pageSize;

    // Chỉ fetch lại nếu trang hiện tại thay đổi
    if (newPage !== currentPage || newPageSize !== pageSize) {
      fetchTraining(newPage, newPageSize);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  const column = [
      {
        title: t("Title"),
        dataIndex: "title",
        key: "title",
        render: (_: string, record: Training) => {
          return <span className="inline-block max-w-[170px] sm:max-w-lg">{record.title}</span>;
        }
      },
      {
        title: t("Creator"),
        dataIndex: "creator",
        key: "creator",
        responsive: ['lg', 'xl', 'xxl'] as Breakpoint[],
        render: (_: string, record: Training) => {
          return <span>{record.creator?.fullName || t("Unknown Host")}</span>;
        },
      },
      {
        title: t("Start Time"),
        dataIndex: "location.startTime",
        key: "startTime",
        responsive: ['sm','md','lg', 'xl', 'xxl'] as Breakpoint[],
        render: (_: string, record: Training) => {
          const date = formatDate(record.location.startTime);
  
          return (
            <span className="text-sm text-gray-600">
              {date.formattedDate} {date.formattedTime}
            </span>
          );
        },
      },
      {
        title: t("Attendees"),
        dataIndex: "attendeeInfo",
        key: "attendeeInfo",
        render: (_: string, record: Training) => {
          const fontColor =
            record.limitRegister &&
            record.currentRegistered! >= record.limitRegister
              ? "text-red-500 font-semibold"
              : "text-green-500 font-semibold";
          return (
            <span className={fontColor}>
              {record.currentRegistered || 0}
              {record.limitRegister
                ? ` / ${record.limitRegister}`
                : ` ${t("ENDED IN")}`}
            </span>
          );
        },
      },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_: string, record: Training) => {
          return (
            <Link
              href={`/training/${record.id}`}
              className="text-blue-500 hover:underline"
            >
              {t("View Details")}
            </Link>
          );
        },
      },
    ];

  return (
   <section className="text-center mb-8">
      <Table
        title={() => {
          return <h2 className="text-2xl font-bold text-left">{title}</h2>;
        }}
        columns={column}
        dataSource={trainings}
        // Cấu hình phân trang
        pagination={{
          current: currentPage + 1, // Ant Design dùng 1-indexed
          pageSize: pageSize,
          total: totalTrainings,
          showSizeChanger: false, // Tùy chọn: Cho phép thay đổi kích thước trang
        }}
        onChange={handleTableChange} // Xử lý sự kiện thay đổi trang/kích thước trang
        loading={loading} // Hiển thị trạng thái tải trong bảng
        bordered={true}
      />

      {/* {!loading && trainings.length > 0  && (
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
      )} */}
    </section>
  );
}
