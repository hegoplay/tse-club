import { Card, Table } from 'antd';
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next';
import UserInfoCard from './UserInfoCard';
// Import kiểu cho cấu hình phân trang của Ant Design
import { TablePaginationConfig } from 'antd/es/table';
import { PageWrapperDto, PointHistoryResponseDto, PointHistoryType } from '@/constant/types';
import { getMyPointHistory } from '@/modules/services/userService';
import { CalendarIcon } from 'lucide-react';


const PointHistoryCard : React.FC<{userId: string}> = ({
  userId
}) => {
  const { t } = useTranslation("common");
  // Lưu ý: localStorage chỉ có thể truy cập được sau khi component đã mount
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const isOwner = user?.id === userId;

  const [pointHistories, setPointHistories] = React.useState<Array<PointHistoryResponseDto>>([]);
  // 1. Thêm trạng thái cho phân trang
  const [currentPage, setCurrentPage] = React.useState(0); // Bắt đầu từ trang 0 (cho API)
  const [totalElements, setTotalElements] = React.useState(0);
  const [loading, setLoading] = React.useState(false); // Thêm trạng thái loading

  const pageSize = 5; // Kích thước trang cố định

  // 2. Cập nhật hàm fetch để nhận tham số page và sử dụng size cố định
  const fetchMyPointHistories = React.useCallback(async (page: number) => {
    if (!isOwner) return;

    setLoading(true);
    try {
      const data = await getMyPointHistory({
        page: page, // Sử dụng trang hiện tại
        size: pageSize, // Sử dụng kích thước trang cố định
        sort: "resetTime,desc",
        pointHistoryType: PointHistoryType.ALL
      }); // Ép kiểu cho response

      const list = data._embedded?.pointHistoryResponseDtoList || [];
      const pageInfo = data.page;

      setPointHistories(list);
      
      // Cập nhật thông tin phân trang từ API
      if (pageInfo) {
        setTotalElements(pageInfo.totalElements);
        setCurrentPage(pageInfo.number); // Đồng bộ số trang với API
      } else {
        setTotalElements(list.length); // Trường hợp không có page info
        setCurrentPage(0);
      }

    } catch (error) {
      console.error("Failed to fetch point histories:", error);
      setPointHistories([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  // 3. Hàm xử lý sự kiện thay đổi trang
  const handleTableChange = (pagination: TablePaginationConfig) => {
    // Ant Design pagination.current là 1-indexed, API thường là 0-indexed.
    const newPage = (pagination.current! - 1); 
    
    // Chỉ gọi fetch nếu trang thay đổi
    if (newPage !== currentPage) {
      fetchMyPointHistories(newPage);
    }
  };

  // useLayoutEffect gọi fetchMyPointHistories với trang đầu tiên (0)
  useLayoutEffect(() => {
    // Luôn gọi trang 0 khi component mount hoặc userId thay đổi
    if (isOwner) {
      fetchMyPointHistories(0);
    }
  }, [isOwner, userId, fetchMyPointHistories]);

  const columns = [
    {
      title: t("Reset Time"),
      dataIndex: 'resetTime',
      key: 'resetTime',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: t("Point Type"),
      dataIndex: 'pointType',
      key: 'pointType',
      render: (text: PointHistoryType) => t(text),
      
    },
    {
      title: t("Points"),
      dataIndex: 'point',
      key: 'point',
    },
    
  ];

  return (
    <UserInfoCard
      title={t("Point History")}
      icon= {<CalendarIcon />}
    >
      <Table
        columns={columns}
        dataSource={pointHistories}
        rowKey="id"
        // 4. Cấu hình Pagination cho Ant Design Table
        pagination={{ 
            current: currentPage + 1, // Ant Design dùng 1-indexed
            pageSize: pageSize,
            total: totalElements,
            showSizeChanger: false, 
            showTotal: (total, range) => t("Showing {{start}}-{{end}} of {{total}} items", { start: range[0], end: range[1], total }),
        }}
        // 5. Thêm handler khi thay đổi trang
        onChange={handleTableChange}
        loading={loading} // Hiển thị loading state trên bảng
      />
    </UserInfoCard>

  )
}

export default PointHistoryCard