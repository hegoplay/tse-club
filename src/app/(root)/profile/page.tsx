"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Table,
  Badge,
  message,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  LockOutlined,
  CalendarOutlined,
  TrophyOutlined,
  StarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getInfoUser,
  updateUserInfo,
  changePassword,
} from "@/modules/services/userService";
import { getRegisteredEvents } from "@/modules/services/eventService";
import { useTranslation } from "react-i18next";
import { Event } from "@/constant/types";
import { formatDate } from "@/lib/utils";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { t } = useTranslation("common");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    fetchData();
    fetchEvents();
  }, []);

  const fetchData = async () => {
    try {
      const info = await getInfoUser();
      setUserInfo(info);
      form.setFieldsValue(info);
    } catch (err) {}
  };

  const fetchEvents = async () => {
    try {
      const res = await getRegisteredEvents();
      setEvents(res);
    } catch (err) {}
  };

  const handleUpdateInfo = async () => {
    try {
      const values = await form.validateFields();
      await updateUserInfo(values);
      message.success("Cập nhật thông tin thành công!");
      setIsEditModalOpen(false);
      fetchData();
    } catch (err) {
      message.error("Cập nhật thất bại!");
    }
  };

  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      await changePassword(values);
      message.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err) {
      message.error("Đổi mật khẩu thất bại!");
    }
  };

  const getBadge = (key: string, value: string) => {
    return (
      <Badge
        key={key}
        count={value}
        style={{
          backgroundColor: "#cf1fb0",
          color: "#000",
        }}
        className="text-sm px-3 py-1"
      />
    );
  }

  const generateUserTypeBadge = (type: number) => {
    const keys = ["student", "member", "teacher", "admin"];
    const values = ["Sinh viên", "Thành viên CLB", "Giảng viên", "Quản trị viên"];
    let badges = [];
    for (let i = 0; i < keys.length; i++) {
      if ((type & (1 << i)) === 0) continue;
        console.log("value: ",values[i]);
        badges.push(getBadge(keys[i], values[i]));
    }
    return <>
      {badges.map((badge) => badge)}
    </>
  }

  const columns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Event) => (
        <a
          href={`/events/${record.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {text}
        </a>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "location.startTime",
      key: "startTime",
      render: (_: any, record: Event) => (
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className="text-gray-400" />
          <span>{formatDate(record.location.startTime)?.formattedDate}</span>
        </div>
      ),
    },
    {
      title: "Địa điểm",
      dataIndex: "location.destination",
      key: "destination",
      render: (_: any, record: Event) => (
        <div className="flex items-center gap-2">
          <EnvironmentOutlined className="text-gray-400" />
          <span>{record.location.destination}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="border-4 border-white shadow-xl bg-blue-300"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
            </div>

            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {userInfo?.nickname || userInfo?.username || "User"}
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                @{userInfo?.username}
              </p>
              <p className="text-blue-100 flex gap-2 text-lg mb-4">
                UID: {userInfo?.id}
                <Button
                  size="small"
                  icon={<CopyIcon size={14} />}
                  onClick={() => {
                    navigator.clipboard.writeText(userInfo?.id || "");
                    toast.success("Copied UID!");
                  }}
                ></Button>
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge
                  count={userInfo?.role}
                  style={{
                    backgroundColor: "#fbbf24",
                    color: "#000",
                  }}
                  className="text-sm px-3 py-1"
                />
                {generateUserTypeBadge(userInfo?.type || 0)}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="primary"
                size="large"
                icon={<EditOutlined />}
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg"
                style={{ color: "#fff" }}
              >
                {t("Edit")}
              </Button>
              <Button
                size="large"
                icon={<LockOutlined />}
                onClick={() => setIsPasswordModalOpen(true)}
                className="bg-blue-500 text-white hover:bg-blue-400 border-0 shadow-lg"
              >
                {t("Change Password")}
              </Button>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info Card */}
          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-blue-600 text-lg" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  {t("THÔNG TIN CÁ NHÂN")}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <span className="text-gray-600">{t("Full Name")}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {userInfo?.fullName || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <span className="text-gray-600">{t("Email")}</span>
                  <span className="font-medium text-gray-800 text-sm">
                    {userInfo?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <span className="text-gray-600">Nickname</span>
                  <span className="font-medium text-gray-800">
                    {userInfo?.nickname || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                  <span className="text-gray-600 flex items-center gap-2">
                    <CalendarOutlined /> {t("Date of birth")}
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDate(userInfo?.dateOfBirth || "")?.formattedDate ||
                      "—"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrophyOutlined className="text-green-600 text-lg" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  {t("Attendance Point")}
                </h3>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {userInfo?.attendancePoint || 0}
                </div>
                <p className="text-gray-600">{t("Điểm hiện có")}</p>
              </div>
            </div>
          </Card>

          {/* Contribution Points Card */}
          <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-purple-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <StarOutlined className="text-purple-600 text-lg" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">
                  {t("Contribution Point")}
                </h3>
              </div>

              <div className="text-center py-4">
                <div className="text-5xl font-bold text-purple-600 mb-2">
                  {userInfo?.contributionPoint || 0}
                </div>
                <p className="text-gray-600">{t("Điểm hiện có")}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Events Table Card */}
        <Card className="rounded-2xl shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <CalendarOutlined className="text-indigo-600 text-lg" />
            </div>
            <h3 className="font-bold text-xl text-gray-800">
              {t("SỰ KIỆN ĐÃ THAM GIA")}
            </h3>
          </div>

          <Table
            columns={columns}
            dataSource={events}
            rowKey="id"
            pagination={{ pageSize: 5, showSizeChanger: false }}
          />
        </Card>

        {/* Edit Info Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <EditOutlined className="text-blue-600" />
              </div>
              <span className="text-lg font-semibold">Cập nhật thông tin</span>
            </div>
          }
          open={isEditModalOpen}
          onOk={handleUpdateInfo}
          onCancel={() => setIsEditModalOpen(false)}
          okText="Lưu thay đổi"
          cancelText="Hủy"
          width={500}
        >
          <Form layout="vertical" form={form} className="mt-6">
            <Form.Item
              name="fullName"
              label={<span className="font-medium">{t("Full Name")}</span>}
            >
              <Input size="large" className="bg-gray-50" />
            </Form.Item>
            <Form.Item
              name="nickname"
              label={<span className="font-medium">Nickname</span>}
            >
              <Input size="large" placeholder="Nhập nickname của bạn" />
            </Form.Item>
            <Form.Item
              name="email"
              label={<span className="font-medium">Email</span>}
            >
              <Input size="large" disabled className="bg-gray-50" />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label={<span className="font-medium">Ngày sinh</span>}
            >
              <Input type="date" size="large" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <LockOutlined className="text-orange-600" />
              </div>
              <span className="text-lg font-semibold">Đổi mật khẩu</span>
            </div>
          }
          open={isPasswordModalOpen}
          onOk={handleChangePassword}
          onCancel={() => setIsPasswordModalOpen(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          width={500}
        >
          <Form layout="vertical" form={passwordForm} className="mt-6">
            <Form.Item
              name="oldPassword"
              label={<span className="font-medium">Mật khẩu cũ</span>}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}
            >
              <Input.Password
                size="large"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label={<span className="font-medium">Mật khẩu mới</span>}
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
              ]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label={<span className="font-medium">Xác nhận mật khẩu mới</span>}
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
