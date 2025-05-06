// components/NavbarWithToggleTabs.tsx
"use client";

import Link from "next/link";  // Link 컴포넌트 임포트
import { useState } from "react";

export default function NavbarWithToggleTabs() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleTabClick = (tab: string) => {
    if (activeTab === tab) {
      setActiveTab(null); // 다시 클릭하면 닫기
    } else {
      setActiveTab(tab); // 새 탭 열기
    }
  };

  return (
    <nav className="p-4 border-b">
      <div className="flex space-x-2">
        {/* Home 버튼 클릭 시 /로 이동 */}
        <Link href="/">
          <button
            className={`px-3 py-2 font-medium rounded-none border-b-2 ${
              activeTab === "home" ? "border-black text-black" : "border-transparent text-gray-500"
            }`}
          >
            Home
          </button>
        </Link>
        
        {/* 다른 탭 버튼들 */}
        <button
          onClick={() => handleTabClick("Test")}
          className={`px-3 py-2 font-medium rounded-none border-b-2 ${
            activeTab === "Test" ? "border-black text-black" : "border-transparent text-gray-500"
          }`}
        >
          Test
        </button>
        <button
          onClick={() => handleTabClick("fmcs")}
          className={`px-3 py-2 font-medium rounded-none border-b-2 ${
            activeTab === "fmcs" ? "border-black text-black" : "border-transparent text-gray-500"
          }`}
        >
          fmcs
        </button>
        <button
          onClick={() => handleTabClick("cloud")}
          className={`px-3 py-2 font-medium rounded-none border-b-2 ${
            activeTab === "cloud" ? "border-black text-black" : "border-transparent text-gray-500"
          }`}
        >
          cloud
        </button>
      </div>

      {/* 하위 메뉴 */}
      <div className="mt-4">
        {activeTab === "Test" && (
          <div className="flex space-x-4">
            <Link href="/excel" className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
              Excel
            </Link>
            <Link href="/mes/dbserverfarm" className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
              Line with App and DB Serverfarm
            </Link>
          </div>
        )}
        {activeTab === "fmcs" && (
          <div className="flex space-x-4">
            <Link href="/fmcs" className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
              FMCS 메인 테스트용
            </Link>
          </div>
        )}
        {activeTab === "cloud" && (
          <div className="flex space-x-4">
            <Link href="/cloud" className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200">
              Cloud 메인 테스트용
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
