"use client";

import { Card } from "antd";
import React from "react";

interface UserInfoCardProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  children,
  icon,
  title,
}) => {
  return (
    <Card className="rounded-2xl shadow-lg border-0 hover:shadow-xl transition-shadow ">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-bold text-xl text-gray-800">{title}</h3>
      </div>
      {children}
    </Card>
  );
};

export default UserInfoCard;
