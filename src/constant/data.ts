export const eventUpcomming = [
  {
    id: 1,
    title: "Hội thảo về Công nghệ Mới",
    date: "2025-09-15",
    description:
      "Tham gia hội thảo để tìm hiểu về các công nghệ mới nhất trong ngành.",
  },
  {
    id: 2,
    title: "Workshop Lập trình Web",
    date: "2025-09-20",
    description:
      "Học cách xây dựng các ứng dụng web hiện đại với các chuyên gia trong lĩnh vực.",
  },
  {
    id: 3,
    title: "Cuộc thi Hackathon",
    date: "2025-08-05",
    description:
      "Tham gia cuộc thi hackathon để thử thách kỹ năng lập trình và sáng tạo của bạn.",
  },
];

export const USER_TYPES = {
  STUDENT: 1 << 0, // 1 (001)
  MEMBER: 1 << 1, // 2 (010)
  LECTURER: 1 << 2, // 4 (100)
  POST_STUDENT: 1 << 3, // 8 (1000)
};

// Mảng cho Checkbox Group
export const USER_TYPE_OPTIONS = [
  { label: "Sinh viên", value: USER_TYPES.STUDENT },
  { label: "Hội viên", value: USER_TYPES.MEMBER },
  { label: "Giảng viên", value: USER_TYPES.LECTURER },
  { label: "Nghiên cứu sinh", value: USER_TYPES.POST_STUDENT },
];