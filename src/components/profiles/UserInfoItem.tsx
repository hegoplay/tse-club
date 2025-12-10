import React from "react";

const UserInfoItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, icon, children }) => {
  return (
    <div className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-lg transition-colors">
      <span className="text-gray-600 flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="font-medium text-gray-800">{children}</span>
    </div>
  );
};

export default UserInfoItem;
