"use client";

import { Checkbox, Form, Input, Modal, Table } from "antd";
import React, { useLayoutEffect } from "react";
import { FileOutlined, LockOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { USER_TYPE_OPTIONS, USER_TYPES } from "@/constant/data";
import {
  PageWrapperDto,
  UserFormResponseDto,
  UserShortInfoResponseDto,
} from "@/constant/types";
import {
  createUpdateRequest,
  decodeBitwiseType,
  deleteUpdateRequest,
  encodeBitwiseType,
  getUpdateRequests,
} from "@/modules/services/userService";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { set } from "lodash";
import { title } from "process";
import { formatDate } from "@/lib/utils";

interface SelfUserUpdateRequestModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  userInfo?: UserShortInfoResponseDto;
  initSize?: number;
}

const SelfUserUpdateRequestModal: React.FC<SelfUserUpdateRequestModalProps> = ({
  isOpen = false,
  onClose = () => {},
  userInfo,
  initSize = 5,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation("common");
  const [loading, setLoading] = React.useState(false);
  const [updateRequests, setUpdateRequests] = React.useState<Array<any>>([]);
  const [size, setSize] = React.useState<number>(initSize);
  const [totalElements, setTotalElements] = React.useState<number>(0);

  const disabled = totalElements >= initSize;

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // form.setFieldsValue({
      //   email: userInfo?.email || "",
      //   type: decodeBitwiseType(userInfo?.type || 0, USER_TYPES),
      // });
      setLoading(true);
      fetchUserUpdateRequests();
    } else {
      document.body.style.overflow = "auto";
    }
    setLoading(false);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const fetchUserUpdateRequests = async () => {
    const data = (await getUpdateRequests({
      size: 5,
      sort: "createdAt,desc",
    })) as PageWrapperDto;
    console.log("User update requests:", data);
    setUpdateRequests(
      (data._embedded && data._embedded.userUpdateFormDtoList) || []
    );
    setSize(data.page.size || initSize);
    setTotalElements(data.page.totalElements || 0);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log("Form values:", values);
        // Xử lý gửi yêu cầu cập nhật thông tin ở đây
        const modifiedType = encodeBitwiseType(values.type || []);
        const res = await createUpdateRequest({
          email: values.email,
          type: modifiedType,
        });
        if (res.detail && res.title) {
          toast.error(res.detail || "Failed to create update request.");
          return;
        }
        toast.success("Yêu cầu cập nhật thông tin đã được gửi thành công.");
        // Đóng modal sau khi gửi yêu cầu
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDeleteRequest = async (id: string) => {
    setLoading(true);
    try {
      await deleteUpdateRequest(id);
      toast.success("Yêu cầu cập nhật thông tin đã được xóa thành công.");
      // Tải lại danh sách yêu cầu sau khi xóa
      await fetchUserUpdateRequests();
    } catch (error) {
      toast.error("Failed to delete update request.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t("Request Time"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_: any, record: UserFormResponseDto) => {
        const formattedDate = formatDate(record.createdAt);
        return <span>{formattedDate.formattedDate}</span>;
      },
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
    },
    {
      title: t("User types"),
      dataIndex: "types",
      key: "types",
      render: (_: any, record: UserFormResponseDto) => {
        const types = decodeBitwiseType(record.type, USER_TYPES);
        const typeLabels = USER_TYPE_OPTIONS.filter((option) =>
          types.includes(option.value)
        ).map((option) => option.label);
        return <span>{typeLabels.join(", ")}</span>;
      },
    },
    {
      title: t("Actions"),
      key: "actions",
      render: (_: any, record: UserFormResponseDto) => (
        <a
          onClick={() => handleDeleteRequest(record.id)}
          className="text-red-600 hover:underline cursor-pointer"
        >
          {t("Delete")}
        </a>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <FileOutlined className="text-orange-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              Thông tin yêu cầu cập nhật thông tin cá nhân
            </span>
            <span className="text-sm text-gray-500 italic">
              Để trống nếu không muốn cập nhật
            </span>
            <span className="text-sm text-gray-500 ">
              {disabled
                ? " Bạn đã đạt đến giới hạn yêu cầu cập nhật thông tin."
                : ""}
            </span>
          </div>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{ disabled: disabled }}
    >
      <Form layout="vertical" form={form} className="mt-6">
        <Form.Item
          name="email"
          label={<span className="font-medium">{t("Email")}</span>}
        >
          <Input size="large" className="bg-gray-50" />
        </Form.Item>
        {/* Bitwise Type */}
        <Form.Item
          name="type"
          label={t("User types")}
          tooltip={t(
            "Selected values are summed using Bitwise OR (|) for saving."
          )}
        >
          <Checkbox.Group
            options={USER_TYPE_OPTIONS.map((option) => ({
              label: option.label,
              value: option.value,
            }))}
            className="grid grid-cols-2 gap-2"
          />
        </Form.Item>
      </Form>

      <Table
        dataSource={updateRequests}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
      />
    </Modal>
  );
};

export default SelfUserUpdateRequestModal;
