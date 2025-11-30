"use client";

import { i18n, useTranslation } from "next-i18next";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { loginWithGoogle } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Image } from "antd";
import { Images } from "@/constant/image";
import { isTokenExpired } from "@/lib/utils";

function SignIn() {
  const { t, i18n } = useTranslation("common");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [language, setLanguage] = useState<string>("vi");

  // 🔁 Lấy ngôn ngữ từ localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "vi";
    setLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        }
      );
      if (!response.ok) throw new Error("Invalid credentials");
      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("accessToken", data.accessToken);
        toast.success(t("Login successful!"));
        router.push("/");
      } else {
        toast.error(t("Login failed!"));
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || t("Login failed!"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.id && token && !isTokenExpired(token)) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
        <div className="flex w-[1000px]">
          {/* Left info section */}
          <div className="flex flex-col md:relative absolute opacity-20 md:opacity-100 justify-center text-[#120e31] px-12 max-w-xl">
            <Image
              src={Images.logoTSE.src}
              preview={false}
              alt="Logo"
              className="w-32 mb-6"
            />
            <div className="md:block hidden">
              <div className="flex justify-between">
                <p className="text-xl font-semibold mb-6">
                  TSE Club - FIT - IUH
                </p>
                <p>Version: 1.0.0</p>
              </div>
              <p className="mb-2">E-MAIL: tseclub@iuh.edu.vn</p>
            </div>
          </div>

          {/* Login box */}
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl p-8 mx-auto md:mr-20  backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
              {t("LOGIN")}
            </h2>

            <div className="flex justify-center mb-6 gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={language === "vi"}
                  onChange={() => handleLanguageChange("vi")}
                />
                Tiếng Việt
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={language === "en"}
                  onChange={() => handleLanguageChange("en")}
                />
                English
              </label>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#120e31] text-sm font-medium mb-2">
                  {t("Username or Email")}
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {error && <div className="text-red-500 mb-4">{error}</div>}

              <button
                type="submit"
                className="w-full bg-[#120e31] text-white font-medium py-2 px-4 rounded-md hover:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? t("Logging in...") : t("LOG IN")}
              </button>
            </form>

            <div className="mt-4 text-center text-gray-500">
              <p>
                {t("Don't have an account?")}{" "}
                <Link href="/signup" className="text-gray-400 hover:underline">
                  {t("Sign up")}
                </Link>{" "}
                {t("or")}{" "}
                <Link href="/" className="text-gray-400 hover:underline">
                  {t("To Homepage")}
                </Link>
              </p>
              <p>
                {t("Didn't remember your password ?")}{" "}
                <Link
                  href="/forgotpassword"
                  className="text-gray-400 hover:underline"
                >
                  {t("Click Here")}
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center text-gray-500">
              <p>{t("or continue with")}</p>
            </div>

            <button
              className="w-full bg-[#120e31] text-white font-medium py-2 px-4 rounded-md hover:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-2"
              onClick={() => loginWithGoogle()}
            >
              {t("Continue with Google")}
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default SignIn;
