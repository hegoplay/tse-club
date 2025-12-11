"use client";

import { useEffect, useState } from "react";
import { getPublicEvents } from "@/modules/services/eventService";
import {
  Event,
  EventSearchRequestDto,
  PageWrapperDto,
  RangeTimeType,
} from "@/constant/types";
import { Breakpoint, Spin, Table, TablePaginationConfig } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/lib/utils";

interface EventSectionProps {
  pageSize?: number;
  seeAll?: boolean;
  eventSearchParams: EventSearchRequestDto;
  title: string;
}

export default function EventSection({
  pageSize = 10,
  seeAll,
  eventSearchParams,
  title,
}: EventSectionProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0); // Bắt đầu từ trang 0 (API thường dùng)
  const [totalEvents, setTotalEvents] = useState(0); // Tổng số sự kiện

  const { t } = useTranslation("common");

  // Hàm fetchEvents được cập nhật để nhận tham số phân trang
  async function fetchEvents(page: number, size: number) {
    setLoading(true);
    try {
      const data: PageWrapperDto = await getPublicEvents({
        // Gửi thông tin phân trang lên API
        page: page,
        size: size,
        rangeTimeType: eventSearchParams.rangeTimeType,
        sort: eventSearchParams.sort || "location.startTime,asc",
        keyword: eventSearchParams.keyword,
        eventType: eventSearchParams.eventType,
        startTime: eventSearchParams.startTime,
        endTime: eventSearchParams.endTime,
        searchs: eventSearchParams.searchs,
        searchValues: eventSearchParams.searchValues,
      });

      setEvents(data._embedded ? data._embedded.eventWrapperDtoList : []); // Cập nhật dữ liệu sự kiện
      setTotalEvents(data.page.totalElements); // Cập nhật tổng số lượng
      setCurrentPage(data.page.number); // Đảm bảo trang hiện tại được đồng bộ với API (thường là number)
    } catch (error) {
      console.error("Failed to fetch public events:", error);
      setEvents([]); // Xóa dữ liệu nếu có lỗi
      setTotalEvents(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);

    const handler = setTimeout(() => {
      fetchEvents(0, pageSize);
    }, 500); // Độ trễ 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [pageSize, eventSearchParams]);

  // Hàm xử lý khi người dùng thay đổi trang
  const handleTableChange = (pagination: TablePaginationConfig) => {
    // Ant Design pagination.current là 1-indexed, API thường là 0-indexed.
    const newPage = pagination.current! - 1;

    // Kiểm tra xem pageSize có thay đổi không, mặc dù thường không thay đổi ở đây
    const newPageSize = pagination.pageSize || pageSize;

    // Chỉ fetch lại nếu trang hiện tại thay đổi
    if (newPage !== currentPage || newPageSize !== pageSize) {
      fetchEvents(newPage, newPageSize);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  const renderAttendeesAndCategory = (record: Event) => {
    const fontColor =
      record.limitRegister && record.currentRegistered! >= record.limitRegister
        ? "text-red-500 font-semibold"
        : "text-green-500 font-semibold";
    return (
      <div className="flex flex-col items-center">
        <span className={fontColor}>
          {record.currentRegistered || 0}
          {record.limitRegister
            ? ` / ${record.limitRegister}`
            : ` ${t("ENDED IN")}`}
        </span>
        <span>{record.category ? t(record.category) : t("N/A")}</span>
      </div>
    );
  };

  const column = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      render: (_: string, record: Event) => {
        return (
          <span className="inline-block max-w-[150px] sm:max-w-lg">
            {record.title}
          </span>
        );
      },
    },
    {
      title: t("Host"),
      dataIndex: "host",
      key: "host",
      responsive: ["lg", "xl", "xxl"] as Breakpoint[],
      render: (_: string, record: Event) => {
        return <span>{record.host?.fullName || t("Unknown Host")}</span>;
      },
    },
    {
      title: t("Start Time"),
      dataIndex: "location.startTime",
      key: "startTime",
      responsive: ["sm", "md", "lg", "xl", "xxl"] as Breakpoint[],
      render: (_: string, record: Event) => {
        const date = formatDate(record.location.startTime);

        return (
          <span className="text-sm text-gray-600">
            {date.formattedDate} {date.formattedTime}
          </span>
        );
      },
    },
    {
      title: t("Category"),
      dataIndex: "category",
      key: "category",
      responsive: ["lg", "xl", "xxl"] as Breakpoint[],
      render: (_: string, record: Event) => {
        return t(record.category || "Uncategorized");
      },
    },
    {
      title: t("Attendees & Category"),
      dataIndex: "attendeeAndCategory",
      key: "attendeeAndCategory",
      responsive: ["xs"] as Breakpoint[],
      render: (_: string, record: Event) => {
        return renderAttendeesAndCategory(record);
      },
    },
    {
      title: t("Attendees"),
      dataIndex: "attendeeInfo",
      key: "attendeeInfo",
      responsive: ["sm", "md", "lg", "xl", "xxl"] as Breakpoint[],
      render: (_: string, record: Event) => {
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
      render: (_: string, record: Event) => {
        return (
          <Link
            href={`/events/${record.id}`}
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
        dataSource={events}
        // Cấu hình phân trang
        pagination={{
          current: currentPage + 1, // Ant Design dùng 1-indexed
          pageSize: pageSize,
          total: totalEvents,
          showSizeChanger: false, // Tùy chọn: Cho phép thay đổi kích thước trang
        }}
        onChange={handleTableChange} // Xử lý sự kiện thay đổi trang/kích thước trang
        loading={loading} // Hiển thị trạng thái tải trong bảng
        bordered={true}
      />

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
