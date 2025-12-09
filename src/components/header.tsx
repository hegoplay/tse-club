"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout, Menu, Button, Dropdown, Select } from "antd";
import {
  GlobalOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Images } from "@/constant/image";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { it } from "node:test";

const { Header: AntHeader } = Layout;

export default function Header() {
  const [fixed, setFixed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLang =
    searchParams.get("lang") || localStorage.getItem("lang") || "vi";

  useEffect(() => {
    localStorage.setItem("lang", currentLang);
    i18n.changeLanguage(currentLang);
  }, [currentLang]);

  const changeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);

    const params = new URLSearchParams(searchParams);
    params.set("lang", newLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setFixed(window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/signin");
  };

  const menuItems = [
    {
      key: "about-us",
      label: (
        <Link className="!text-black" href="/">
          {t("About us")}
        </Link>
      ),
    },
    !isLoggedIn ?  
    {
      key: "join-us",
      label: (
        <Link className="!text-black" href="/signup">
          {t("Join Our Club")}
        </Link>
      ),
    } : null,
    {
      key: "events",
      label: (
        <Link className="!text-black" href="/events">
          {t("Events")}
        </Link>
      ),
    },
    {
      key: "posts",
      label: (
        <Link className="!text-black" href="/posts">
          {t("Blog")}
        </Link>
      ),
    },
  ];

  const userMenu = {
    items: [
      {
        key: "profile",
        label: <Link href="/profile">{t("Profile")}</Link>,
        icon: <UserOutlined />,
      },
      {
        key: "logout",
        label: <span onClick={handleLogout}>{t("Logout")}</span>,
        icon: <LogoutOutlined />,
      },
    ],
  };

  return (
    <Layout>
      {/* 🔹 Thanh top */}
      <div className="w-full bg-[#1c1c20] flex justify-between items-center px-2 md:px-6 py-2 text-white text-md">
        <div className="flex items-center gap-2">
          <img src={Images.logoIUH2.src} className="h-6 md:h-10" />
          <p className="text-md hidden md:inline">
            {t("Industrial University of Ho Chi Minh City")}
          </p>
        </div>

        {/* 🔹 Chuyển ngôn ngữ + tài khoản */}
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Select
              defaultValue={i18n.language}
              value={i18n.language}
              onChange={changeLanguage}
              className="min-w-24"
              suffixIcon={<GlobalOutlined />}
            >
              <Select.Option value="vi">Tiếng Việt</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>

            <Link href="/signup" className="hover:underline !text-[#fff]">
              {t("Sign Up")}
            </Link>
            <Button
              href="/signin"
              className="!border-white hover:bg-white hover:text-black transition-all"
            >
              {t("Log In")}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Select
              defaultValue={i18n.language}
              value={i18n.language}
              onChange={changeLanguage}
              className="min-w-24"
              suffixIcon={<GlobalOutlined />}
            >
              <Select.Option value="vi">Tiếng Việt</Select.Option>
              <Select.Option value="en">English</Select.Option>
            </Select>

            <Dropdown menu={userMenu} placement="bottomRight">
              <Button
                type="text"
                icon={<UserOutlined />}
                className="!text-white hover:!text-gray-300"
              >
                {user?.username || t("User")}
              </Button>
            </Dropdown>
          </div>
        )}
      </div>

      <AntHeader
        style={{
          background: "#fff",
          position: fixed ? "fixed" : "relative",
          top: fixed ? 0 : "auto",
          width: "100%",
          zIndex: 1000,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          height: 72,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "all 0.3s",
        }}
      >
        {/* Logo */}
        <Link href="/" className="mr-8">
          <img
            src={Images.logoTSE2.src}
            alt="TSE Club"
            className="h-15 rounded-full"
          />
        </Link>

        {/* 🖥️ Menu Desktop */}
        <div className="hidden md:flex flex-1">
          <Menu
            mode="horizontal"
            items={menuItems}
            style={{
              flex: 1,
              borderBottom: "none",
              fontWeight: 600,
            }}
            className="!text-[#120e31]"
          />
        </div>

        {/* 📱 Nút mở menu mobile */}
        <div className="md:hidden ml-auto">
          <Button
            type="text"
            icon={
              menuOpen ? (
                <CloseOutlined style={{ fontSize: 22 }} />
              ) : (
                <MenuOutlined style={{ fontSize: 22 }} />
              )
            }
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* 📱 Menu Mobile trượt xuống từ lằn đỏ */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[72px] left-0 w-full bg-white shadow-md flex flex-col items-start px-6 py-4 gap-4 z-[999] md:hidden"
            >
              {menuItems.filter(item => item != null).map((item) => (
                <Link
                  key={item.key}
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-semibold text-[#120e31] hover:text-[#2ca01c] transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </AntHeader>
    </Layout>
  );
}
