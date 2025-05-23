import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiGrid, FiUsers, FiSettings, FiClock, FiTrendingUp, FiShoppingBag } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import authAxios from '../../utils/authAxios';

export default function AdminDashboardPage() {
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 使用authAxios來獲取所有訂單進行統計
        const response = await authAxios.get('/orders');
        const orders = response.data;

        // 計算各狀態訂單數量
        const stats = {
          pending: orders.filter(order => order.status === '待處理').length,
          processing: orders.filter(order => order.status === '製作中').length,
          ready: orders.filter(order => order.status === '待配送/取貨').length,
          completed: orders.filter(order => order.status === '已完成').length,
          cancelled: orders.filter(order => order.status === '已取消').length,
          total: orders.length
        };

        setOrderStats(stats);

        // 獲取最近5筆訂單
        const recent = [...orders]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentOrders(recent);
      } catch (error) {
        console.error('獲取儀表板數據失敗:', error);
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 獲取訂單客戶資訊
  const getCustomerInfo = (order) => {
    if (order.deliveryMethod === 'delivery') {
      return order.deliveryInfo?.name;
    } else {
      return order.pickupInfo?.name;
    }
  };

  // 根據狀態顯示不同背景色
  const getStatusColor = (status) => {
    switch (status) {
      case '待處理':
        return 'bg-blue-100 text-blue-800';
      case '製作中':
        return 'bg-yellow-100 text-yellow-800';
      case '待配送/取貨':
        return 'bg-purple-100 text-purple-800';
      case '已完成':
        return 'bg-green-100 text-green-800';
      case '已取消':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800">歡迎回來，管理員</h2>
        <p className="text-gray-600">檢視並管理您的烘焙坊業務</p>
      </div>

      {/* 總覽卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FiClock className="text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">待處理訂單</p>
              <h3 className="text-xl font-bold text-gray-800">{orderStats.pending}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiPackage className="text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">製作中</p>
              <h3 className="text-xl font-bold text-gray-800">{orderStats.processing}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <FiShoppingBag className="text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">待配送/取貨</p>
              <h3 className="text-xl font-bold text-gray-800">{orderStats.ready}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FiTrendingUp className="text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">已完成</p>
              <h3 className="text-xl font-bold text-gray-800">{orderStats.completed}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-500">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full">
              <FiShoppingBag className="text-gray-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">總訂單數</p>
              <h3 className="text-xl font-bold text-gray-800">{orderStats.total}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* 快速訪問區塊 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
          <FiPackage className="text-3xl text-[#5a6440] mx-auto mb-2" />
          <h3 className="font-medium">訂單管理</h3>
        </Link>
        <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
          <FiGrid className="text-3xl text-[#5a6440] mx-auto mb-2" />
          <h3 className="font-medium">商品管理</h3>
        </Link>
        <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
          <FiUsers className="text-3xl text-[#5a6440] mx-auto mb-2" />
          <h3 className="font-medium">會員管理</h3>
        </Link>
        <Link to="/admin/settings" className="bg-white p-6 rounded-lg shadow text-center hover:bg-gray-50 transition-colors">
          <FiSettings className="text-3xl text-[#5a6440] mx-auto mb-2" />
          <h3 className="font-medium">網站設定</h3>
        </Link>
      </div>

      {/* 最近訂單 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">最近訂單</h3>
        </div>

        {loading ? (
          <div className="p-4 text-center text-gray-500">載入中...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單編號</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getCustomerInfo(order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    NT$ {order.totalAmount.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/orders/${order.id}`} className="text-[#5a6440] hover:text-[#47512f]">
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    沒有最近訂單
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <div className="p-4 bg-gray-50 border-t">
          <Link to="/admin/orders" className="text-[#5a6440] hover:text-[#47512f] font-medium">
            查看所有訂單 →
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
