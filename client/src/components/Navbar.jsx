import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NavbarUserMenu } from './NavbarUserMenu';
import ShoppingCartIcon from './common/ShoppingCartIcon';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 手機選單狀態

  return (
    <header className="bg-[#EDE0C9] shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/assets/Logo.png" alt="Logo" className="h-12 w-auto" />
        </div>

        {/* 桌面版導航 */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="/" className="text-gray-600 hover:text-[#8B5A2B]">HOME</a>
          <a href="/about" className="text-gray-600 hover:text-[#8B5A2B]">關於我們</a>
          <a href="/news" className="text-gray-600 hover:text-[#8B5A2B]">最新消息</a>
          {/* 下拉選單 */}
          <div className="relative group">
            <a href="/products#recommended" className="text-gray-600 hover:text-[#8B5A2B] flex items-center">
              品項介紹
              <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </a>
            <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
              <a href="/products#classic" className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B]">經典系列</a>
              <a href="/products#special" className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B]">特製蛋糕</a>
              <a href="/products#mix" className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B5A2B]">其他甜點</a>
            </div>
          </div>
          <a href="/locations" className="text-gray-600 hover:text-[#8B5A2B]">門市資訊</a>
          <a href="/contact" className="text-gray-600 hover:text-[#8B5A2B]">聯絡我們</a>
        </nav>

        {/* 桌面版 用戶選單、購物車圖示 */}
        <div className="hidden md:flex items-center space-x-4">
          <ShoppingCartIcon />
          <NavbarUserMenu />
        </div>

        {/* 手機版選單按鈕 */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 手機版彈出選單 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-40">
          <nav className="flex flex-col space-y-2 px-4 py-4">
            <a href="/" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">HOME</a>
            <a href="/about" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">關於我們</a>
            <a href="/news" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">最新消息</a>
            <a href="/products" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">麵包蛋糕</a>
            <a href="/locations" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">門市資訊</a>
            <a href="/contact" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">聯絡我們</a>
            <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-2">
              {/* 手機版用戶選單 */}
              <MobileUserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

// 手機版用戶選單組件
function MobileUserMenu() {
  // 獲取用戶資訊
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userJSON = localStorage.getItem('userDisplay');
      if (userJSON) {
        setUser(JSON.parse(userJSON));
      }
    } catch (error) {
      console.error('獲取用戶資訊失敗:', error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        credentials: 'include',
      });

      // 清除所有用戶相關數據
      localStorage.removeItem('userDisplay');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('tokenExpiry');

      setUser(null);
      window.dispatchEvent(new Event('userLoggedOut'));

      // 刷新頁面以確保所有組件狀態都被重置
      window.location.reload();

      navigate('/');
    } catch (error) {
      console.error('登出請求失敗:', error);
      // 即使請求失敗，仍然清除本地存儲
      localStorage.removeItem('userDisplay');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('tokenExpiry');
      setUser(null);
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <>
        <a href="/register" className="text-gray-700 hover:bg-[#F5E8D0] block px-3 py-2 rounded-md text-base font-medium">註冊</a>
        <a href="/login" className="bg-[#8B5A2B] text-white text-center block px-3 py-2 rounded-md text-base font-medium hover:bg-[#A67C52]">登入</a>
      </>
    );
  }

  return (
    <>
      <Link to="/profile" className="px-3 py-2 text-base font-medium flex items-center hover:bg-[#F5E8D0] rounded-md">
        <div className="h-8 w-8 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center mr-2">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-gray-700">{user.name}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:bg-[#F5E8D0] block w-full text-left px-3 py-2 rounded-md text-base font-medium"
      >
        登出
      </button>
    </>
  );
}
