"use client";

import Link from "next/link";
import { Layout, Button } from "antd";
import { FacebookFilled, LinkedinFilled } from "@ant-design/icons";
import { Images } from "@/constant/image";

export default function Footer() {
  return (
    <div className="p-0">
      {/* Main footer */}
      <div className="flex flex-col md:flex-row w-full relative">
        {/* Left green section */}
        <div className="bg-[#1664ca] md:w-1/6  text-white flex flex-col items-center relative justify-center">
          <img src={Images.logoTSE.src} alt="Code Club" className="h-40" />
          <div className="flex items-center mb-4"></div>
        </div>

        {/* Middle links */}
        <div className="bg-[#303048] md:w-5/6 p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
          <div>
            <h3 className="font-semibold text-[18px] mb-2">Get Involved</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#">Join a club</Link>
              </li>
              <li>
                <Link href="#">Run a club</Link>
              </li>
              <li>
                <Link href="#">Partner with us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[18px] mb-2">Learn</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#">Start coding</Link>
              </li>
              <li>
                <Link href="#">Resources</Link>
              </li>
              <li>
                <Link href="#">About</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[18px] mb-2">Our Community</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#">Blog</Link>
              </li>
              <li>
                <Link href="#">Events</Link>
              </li>
              <li>
                <Link href="#">Our partner network</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[18px] mb-2">Support</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="#">Help</Link>
              </li>
              <li>
                <Link href="#">Policies</Link>
              </li>
              <li>
                <Link href="#">Donate</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-black text-white flex flex-col md:flex-row items-center justify-between px-6 py-3 text-sm">
        <p>© 2025 Industrial University of Ho Chi Minh city</p>
        <div className="flex gap-3 mt-3 md:mt-0">
          <Button
            shape="circle"
            icon={<FacebookFilled />}
            href="#"
            target="_blank"
          />
          <Button
            shape="circle"
            icon={<LinkedinFilled />}
            href="#"
            target="_blank"
          />
        </div>
      </div>
    </div>
  );
}
