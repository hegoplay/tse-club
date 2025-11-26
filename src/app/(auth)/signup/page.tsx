"use client";

import { useTranslation } from "next-i18next";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Images } from "@/constant/image";
import Image from "next/image";

function SignUp() {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    studentId: "",
    dateOfBirth: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      toast.success(t("Registration successful!"));
      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || t("Registration failed!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
        <Image
          alt=""
          className="absolute w-full md:w-1/2 h-full object-cover top-0 left-0 opacity-10"
          src={Images.sinhVien.src}
          width={2000}
          height={2000}
        />

        <div className="flex w-[1000px] gap-10">
          {/* Left section with logo and info */}
          <div className="md:flex flex-col absolute md:relative opacity-20 md:opacity-100 justify-center text-[#120e31]  px-12 max-w-xl">
            <Image
              src={Images.logoTSE.src}
              alt="Logo"
              className="w-full mb-6"
              width={400}
              height={400}
            />
            <div className="md:block hidden">
              <div className="flex justify-between">
                <p className="text-xl font-semibold mb-6">
                  TSE Club - FIT - IUH
                </p>
                <p> Version: 1.0.0 </p>
              </div>
              <p className="mb-2">E-MAIL: tseclub@iuh.edu.vn</p>
            </div>
          </div>

          {/* Sign up box */}
          <div className="relative z-10 w-full max-w-md rounded-xl shadow-2xl p-8 mx-auto  backdrop-blur">
            {/* Language switcher */}
            <div className="flex justify-end mb-4 space-x-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lang"
                  value="vi"
                  checked={i18n.language === "vi"}
                  onChange={() => handleLanguageChange("vi")}
                />
                <span>Vietnamese</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="lang"
                  value="en"
                  checked={i18n.language === "en"}
                  onChange={() => handleLanguageChange("en")}
                />
                <span>English</span>
              </label>
            </div>

            {/* Title with gradient text */}
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t("SIGN UP")}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Full Name")}
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Username")}
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Email")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Student ID")}
                </label>
                <input
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Date of Birth")}
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4 relative">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Password")}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 top-8 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff color="gray" />
                  ) : (
                    <Eye color="gray" />
                  )}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#120e31] text-white font-medium py-2 px-4 rounded-md hover:bg-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={loading}
              >
                {loading ? t("Signing up...") : t("SIGN UP")}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-500">
              <p>
                {t("Already have an account?")}{" "}
                <Link href="/signin" className="text-gray-400 hover:underline">
                  {t("Sign in")}
                </Link>
              </p>
              <p>
                {t("Register later")} -{" "}
                <Link href="/" className="text-gray-400 hover:underline">
                  {t("Use as Guest")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default SignUp;
